import type { RoastResult } from "./types";

const STORAGE_KEY = "devroast.learning.v1";

interface RoastMemory {
  sessions: number;
  avgScore: number;
  prefersConcise: boolean;
}

function readMemory(): RoastMemory {
  if (typeof window === "undefined") {
    return { sessions: 0, avgScore: 5, prefersConcise: true };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: 0, avgScore: 5, prefersConcise: true };
    return JSON.parse(raw) as RoastMemory;
  } catch {
    return { sessions: 0, avgScore: 5, prefersConcise: true };
  }
}

function writeMemory(memory: RoastMemory) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
}

export function getLearnedHints(): string[] {
  const memory = readMemory();
  const hints = [
    memory.prefersConcise
      ? "Prefer concise findings and short fix lines."
      : "Allow slightly richer explanations.",
  ];

  if (memory.sessions >= 5) {
    hints.push(
      memory.avgScore < 5
        ? "User code quality trend is low: emphasize highest-impact fixes."
        : "User code quality trend is improving: keep strict but balanced tone.",
    );
  }

  return hints;
}

export function updateLearningFromResult(result: RoastResult) {
  const prev = readMemory();
  const sessions = prev.sessions + 1;
  const avgScore = Number(
    ((prev.avgScore * prev.sessions + result.score) / sessions).toFixed(2),
  );

  writeMemory({
    sessions,
    avgScore,
    prefersConcise: true,
  });
}
