export type RoastSeverity = "critical" | "warning" | "good";
export type RoastBudgetMode = "cheap" | "balanced" | "deep";

export interface RoastFinding {
  severity: RoastSeverity;
  title: string;
  description: string;
}

export interface RoastResult {
  score: number;
  totalIssues: number;
  critical: number;
  warnings: number;
  good: number;
  language: string;
  summary: string;
  findings: RoastFinding[];
  suggestedFixes: string[];
  meta: {
    model: string;
    budgetMode: RoastBudgetMode;
    inputTokensEstimate: number;
    outputTokensLimit: number;
  };
}

export interface RoastRequestPayload {
  code: string;
  language: string;
  roastMode: boolean;
  budgetMode: RoastBudgetMode;
  learnedHints?: string[];
}
