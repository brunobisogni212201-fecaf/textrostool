import type { RoastBudgetMode } from "./types";

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

export function resolveOutputTokenLimit(
  budgetMode: RoastBudgetMode,
  codeLength: number,
): number {
  const baseByMode: Record<RoastBudgetMode, number> = {
    cheap: 420,
    balanced: 850,
    deep: 1400,
  };

  const base = baseByMode[budgetMode];
  if (codeLength > 5000) return Math.min(base, 700);
  if (codeLength > 2000) return Math.min(base, 900);
  return base;
}

export function buildRoastSystemPrompt() {
  return [
    "You are DevRoast, a senior code reviewer that is concise, actionable, and technically strict.",
    "Return ONLY valid JSON, no markdown fences, no extra text.",
    "Prioritize correctness, security, performance, and maintainability.",
    "When roast mode is enabled, keep sarcasm short and playful, never toxic, never offensive.",
    "Optimize for free-tier inference: be direct, avoid long prose, avoid repetition.",
  ].join(" ");
}

export function buildRoastUserPrompt(input: {
  code: string;
  language: string;
  roastMode: boolean;
  budgetMode: RoastBudgetMode;
  learnedHints?: string[];
}) {
  const hints = input.learnedHints?.length
    ? `Learned hints from previous sessions: ${input.learnedHints.join(" | ")}`
    : "Learned hints from previous sessions: none";

  return `
Analyze this code and return strict JSON in the schema below.

Language: ${input.language}
Roast mode: ${input.roastMode ? "on" : "off"}
Budget mode: ${input.budgetMode}
${hints}

Schema:
{
  "score": number, // 0 to 10
  "summary": string, // max 280 chars
  "findings": [
    {
      "severity": "critical" | "warning" | "good",
      "title": string, // max 60 chars
      "description": string // max 220 chars
    }
  ],
  "suggestedFixes": [string] // shell or code-level short fix lines
}

Rules:
- Keep between 4 and 8 findings.
- Include at least 1 positive finding when possible.
- "critical" only for real risk.
- Ensure JSON is parseable.

Code:
${input.code}
`.trim();
}
