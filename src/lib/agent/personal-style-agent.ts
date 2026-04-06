export interface StyleSignals {
  semicolonRate: number;
  singleQuoteRate: number;
  typescriptRate: number;
  functionalRate: number;
  asyncAwaitRate: number;
}

export interface PersonalStyleProfile {
  version: number;
  sessions: number;
  lastUpdatedAt: string;
  daysActive: string[];
  signals: StyleSignals;
  preferredLanguages: Record<string, number>;
  favoritePatterns: string[];
}

export const DEFAULT_STYLE_PROFILE: PersonalStyleProfile = {
  version: 1,
  sessions: 0,
  lastUpdatedAt: new Date(0).toISOString(),
  daysActive: [],
  signals: {
    semicolonRate: 0.5,
    singleQuoteRate: 0.5,
    typescriptRate: 0.5,
    functionalRate: 0.5,
    asyncAwaitRate: 0.5,
  },
  preferredLanguages: {},
  favoritePatterns: [],
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));

function countMatches(code: string, regex: RegExp): number {
  const matches = code.match(regex);
  return matches ? matches.length : 0;
}

export function inferStyleSignalsFromCode(code: string): StyleSignals {
  const totalStatements = Math.max(1, countMatches(code, /[\n;]/g));
  const semicolons = countMatches(code, /;/g);
  const singleQuotes = countMatches(code, /'[^']*'/g);
  const doubleQuotes = countMatches(code, /"[^"]*"/g);
  const tsIndicators = countMatches(
    code,
    /\b(interface|type|enum|implements|readonly)\b|:\s*[A-Z_a-z][\w<>,\s[\]|]*/g,
  );
  const functionalIndicators = countMatches(
    code,
    /\.map\(|\.filter\(|\.reduce\(|=>/g,
  );
  const imperativeIndicators = countMatches(code, /\bfor\s*\(|\bwhile\s*\(/g);
  const asyncIndicators = countMatches(code, /\basync\b|\bawait\b/g);

  const quoteTotal = Math.max(1, singleQuotes + doubleQuotes);
  const flowTotal = Math.max(1, functionalIndicators + imperativeIndicators);

  return {
    semicolonRate: clamp(semicolons / totalStatements),
    singleQuoteRate: clamp(singleQuotes / quoteTotal),
    typescriptRate: clamp(tsIndicators / Math.max(1, totalStatements / 4)),
    functionalRate: clamp(functionalIndicators / flowTotal),
    asyncAwaitRate: clamp(asyncIndicators / Math.max(1, totalStatements / 4)),
  };
}

function mergeSignal(current: number, next: number, alpha = 0.25): number {
  return clamp(current * (1 - alpha) + next * alpha);
}

export function updateStyleProfile(input: {
  profile: PersonalStyleProfile;
  code: string;
  language: string;
  score?: number;
}): PersonalStyleProfile {
  const detected = inferStyleSignalsFromCode(input.code);
  const scoreBoost =
    typeof input.score === "number" ? clamp(input.score / 10) : 0.5;
  const alpha = 0.12 + scoreBoost * 0.18;
  const today = new Date().toISOString().slice(0, 10);

  const daysActive = input.profile.daysActive.includes(today)
    ? input.profile.daysActive
    : [...input.profile.daysActive, today].slice(-60);

  const preferredLanguages = {
    ...input.profile.preferredLanguages,
    [input.language]:
      (input.profile.preferredLanguages[input.language] ?? 0) + 1,
  };

  const favoritePatterns = [
    detected.functionalRate > 0.55 ? "functional transformations" : "",
    detected.typescriptRate > 0.55 ? "strong typing" : "",
    detected.asyncAwaitRate > 0.4 ? "async/await flow" : "",
  ]
    .filter(Boolean)
    .reduce<string[]>(
      (acc, pattern) => {
        if (!acc.includes(pattern)) acc.push(pattern);
        return acc;
      },
      [...input.profile.favoritePatterns],
    )
    .slice(-8);

  return {
    ...input.profile,
    sessions: input.profile.sessions + 1,
    lastUpdatedAt: new Date().toISOString(),
    daysActive,
    preferredLanguages,
    favoritePatterns,
    signals: {
      semicolonRate: mergeSignal(
        input.profile.signals.semicolonRate,
        detected.semicolonRate,
        alpha,
      ),
      singleQuoteRate: mergeSignal(
        input.profile.signals.singleQuoteRate,
        detected.singleQuoteRate,
        alpha,
      ),
      typescriptRate: mergeSignal(
        input.profile.signals.typescriptRate,
        detected.typescriptRate,
        alpha,
      ),
      functionalRate: mergeSignal(
        input.profile.signals.functionalRate,
        detected.functionalRate,
        alpha,
      ),
      asyncAwaitRate: mergeSignal(
        input.profile.signals.asyncAwaitRate,
        detected.asyncAwaitRate,
        alpha,
      ),
    },
  };
}

export function buildPersonalStyleHints(
  profile: PersonalStyleProfile,
): string[] {
  const hints: string[] = [];
  hints.push(
    profile.signals.semicolonRate >= 0.5
      ? "Use semicolons consistently."
      : "Keep semicolons minimal unless required.",
  );
  hints.push(
    profile.signals.singleQuoteRate >= 0.5
      ? "Prefer single quotes where possible."
      : "Prefer double quotes where possible.",
  );
  hints.push(
    profile.signals.typescriptRate >= 0.55
      ? "Favor strong TypeScript typing and explicit interfaces."
      : "Avoid over-typing and keep types pragmatic.",
  );
  hints.push(
    profile.signals.functionalRate >= 0.55
      ? "Prefer functional iteration (map/filter/reduce) over loops when clear."
      : "Prefer straightforward imperative control flow when clearer.",
  );
  hints.push(
    profile.signals.asyncAwaitRate >= 0.4
      ? "Prefer async/await with explicit error handling."
      : "Use async patterns only where necessary.",
  );

  if (profile.favoritePatterns.length > 0) {
    hints.push(`Known style patterns: ${profile.favoritePatterns.join(", ")}.`);
  }

  const topLanguages = Object.entries(profile.preferredLanguages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang);
  if (topLanguages.length > 0) {
    hints.push(`Frequent languages: ${topLanguages.join(", ")}.`);
  }

  return hints;
}

export function optimizeStyleProfileDaily(
  profile: PersonalStyleProfile,
): PersonalStyleProfile {
  const decayedLanguages = Object.fromEntries(
    Object.entries(profile.preferredLanguages).map(([lang, score]) => [
      lang,
      Math.max(0, score - 0.02),
    ]),
  );

  return {
    ...profile,
    lastUpdatedAt: new Date().toISOString(),
    preferredLanguages: decayedLanguages,
  };
}
