import { NextResponse } from "next/server";
import {
  buildPersonalStyleHints,
  updateStyleProfile,
} from "@/lib/agent/personal-style-agent";
import {
  readStyleProfile,
  writeStyleProfile,
} from "@/lib/agent/style-profile-store";
import { buildRoastResultFromModelResponse } from "@/lib/roast/parse";
import {
  buildRoastSystemPrompt,
  buildRoastUserPrompt,
  DEFAULT_GEMINI_MODEL,
  estimateTokens,
  resolveOutputTokenLimit,
} from "@/lib/roast/prompt";
import type { RoastRequestPayload } from "@/lib/roast/types";

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RoastRequestPayload;
    if (!body?.code?.trim()) {
      return NextResponse.json({ error: "Code is required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY environment variable." },
        { status: 500 },
      );
    }

    const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
    const inputTokensEstimate = estimateTokens(body.code);
    const outputTokensLimit = resolveOutputTokenLimit(
      body.budgetMode,
      body.code.length,
    );
    const styleProfile = await readStyleProfile();
    const styleHints = buildPersonalStyleHints(styleProfile);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: buildRoastUserPrompt({
                    code: body.code,
                    language: body.language,
                    roastMode: body.roastMode,
                    budgetMode: body.budgetMode,
                    learnedHints: [...(body.learnedHints ?? []), ...styleHints],
                  }),
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [{ text: buildRoastSystemPrompt() }],
          },
          generationConfig: {
            temperature: 0.2,
            topP: 0.9,
            maxOutputTokens: outputTokensLimit,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json(
        { error: "Gemini API request failed", detail },
        { status: 502 },
      );
    }

    const data = (await response.json()) as GeminiGenerateContentResponse;
    const rawText =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("\n")
        .trim() || "";

    if (!rawText) {
      return NextResponse.json(
        { error: "Gemini returned an empty response." },
        { status: 502 },
      );
    }

    const result = buildRoastResultFromModelResponse({
      rawText,
      fallbackLanguage: body.language,
      model,
      budgetMode: body.budgetMode,
      inputTokensEstimate,
      outputTokensLimit,
    });

    const updatedProfile = updateStyleProfile({
      profile: styleProfile,
      code: body.code,
      language: body.language,
      score: result.score,
    });
    await writeStyleProfile(updatedProfile);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
