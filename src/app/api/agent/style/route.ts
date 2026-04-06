import { NextResponse } from "next/server";
import {
  buildPersonalStyleHints,
  optimizeStyleProfileDaily,
  updateStyleProfile,
} from "@/lib/agent/personal-style-agent";
import {
  getStyleProfilePath,
  readStyleProfile,
  writeStyleProfile,
} from "@/lib/agent/style-profile-store";

export const runtime = "nodejs";

export async function GET() {
  const profile = await readStyleProfile();
  return NextResponse.json({
    profile,
    hints: buildPersonalStyleHints(profile),
    path: getStyleProfilePath(),
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      code?: string;
      language?: string;
      score?: number;
      optimizeDaily?: boolean;
    };

    let profile = await readStyleProfile();
    if (body.optimizeDaily) {
      profile = optimizeStyleProfileDaily(profile);
      await writeStyleProfile(profile);
      return NextResponse.json({
        profile,
        hints: buildPersonalStyleHints(profile),
        path: getStyleProfilePath(),
      });
    }

    if (!body.code || !body.language) {
      return NextResponse.json(
        { error: "code and language are required" },
        { status: 400 },
      );
    }

    profile = updateStyleProfile({
      profile,
      code: body.code,
      language: body.language,
      score: body.score,
    });
    await writeStyleProfile(profile);

    return NextResponse.json({
      profile,
      hints: buildPersonalStyleHints(profile),
      path: getStyleProfilePath(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected style agent error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
