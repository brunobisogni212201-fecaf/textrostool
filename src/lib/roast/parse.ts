import type { RoastFinding, RoastResult, RoastSeverity } from "./types";

const VALID_SEVERITIES: RoastSeverity[] = ["critical", "warning", "good"];

function clampScore(value: unknown): number {
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return 5;
  return Math.min(10, Math.max(0, Number(num.toFixed(1))));
}

function normalizeSeverity(value: unknown): RoastSeverity {
  if (typeof value !== "string") return "warning";
  const lower = value.toLowerCase() as RoastSeverity;
  return VALID_SEVERITIES.includes(lower) ? lower : "warning";
}

function normalizeFindings(value: unknown): RoastFinding[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const obj = typeof item === "object" && item ? item : {};
      const title =
        typeof (obj as { title?: unknown }).title === "string"
          ? (obj as { title: string }).title.slice(0, 80)
          : "Untitled finding";
      const description =
        typeof (obj as { description?: unknown }).description === "string"
          ? (obj as { description: string }).description.slice(0, 320)
          : "No description provided.";
      return {
        severity: normalizeSeverity((obj as { severity?: unknown }).severity),
        title,
        description,
      };
    })
    .slice(0, 10);
}

function extractJsonObject(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model did not return JSON payload");
  }
  return text.slice(start, end + 1);
}

export function buildRoastResultFromModelResponse(input: {
  rawText: string;
  fallbackLanguage: string;
  model: string;
  budgetMode: "cheap" | "balanced" | "deep";
  inputTokensEstimate: number;
  outputTokensLimit: number;
}): RoastResult {
  const parsed = JSON.parse(extractJsonObject(input.rawText)) as {
    score?: unknown;
    summary?: unknown;
    findings?: unknown;
    suggestedFixes?: unknown;
  };

  const findings = normalizeFindings(parsed.findings);
  const critical = findings.filter((f) => f.severity === "critical").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;
  const good = findings.filter((f) => f.severity === "good").length;
  const suggestedFixes = Array.isArray(parsed.suggestedFixes)
    ? parsed.suggestedFixes
        .filter((line): line is string => typeof line === "string")
        .slice(0, 12)
    : [];

  return {
    score: clampScore(parsed.score),
    totalIssues: findings.length,
    critical,
    warnings,
    good,
    language: input.fallbackLanguage,
    summary:
      typeof parsed.summary === "string"
        ? parsed.summary.slice(0, 320)
        : "Roast generated successfully.",
    findings,
    suggestedFixes,
    meta: {
      model: input.model,
      budgetMode: input.budgetMode,
      inputTokensEstimate: input.inputTokensEstimate,
      outputTokensLimit: input.outputTokensLimit,
    },
  };
}
