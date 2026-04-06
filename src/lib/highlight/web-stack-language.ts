export const POPULAR_STACK_LANGUAGES = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "html",
  "css",
  "json",
  "python",
  "go",
  "java",
  "ruby",
  "rails",
  "sql",
  "nosql",
  "shell",
  "react-native",
  "flutter",
  "swift",
] as const;

export type PopularStackLanguage = (typeof POPULAR_STACK_LANGUAGES)[number];
export type PopularStackLanguageMode = PopularStackLanguage | "auto";

const BASE_PRIORITY: readonly PopularStackLanguage[] = POPULAR_STACK_LANGUAGES;

const TS_REGEXES = [
  /\binterface\s+\w+/,
  /\btype\s+\w+\s*=/,
  /\benum\s+\w+/,
  /\bimplements\s+\w+/,
  /:\s*(string|number|boolean|unknown|any|void|never)\b/,
  /\bas\s+const\b/,
];

const JS_KEYWORDS_REGEX = /\b(const|let|var|function|return|import|export)\b/;
const JSX_TAG_REGEX = /<[A-Za-z][A-Za-z0-9]*(\s[^>]*)?>/;
const HTML_TAG_REGEX = /<\/?[a-z][\w-]*(\s[^>]*)?>/i;
const CSS_BLOCK_REGEX = /[.#]?[a-zA-Z][\w-]*\s*\{[^}]+\}/;
const CSS_PROP_REGEX = /\b[a-z-]+\s*:\s*[^;]+;/i;
const PYTHON_REGEXES = [
  /^\s*def\s+\w+\(/m,
  /^\s*class\s+\w+(\(.*\))?:/m,
  /^\s*from\s+\w+\s+import\s+/m,
  /^\s*import\s+\w+/m,
];
const GO_REGEXES = [
  /^\s*package\s+\w+/m,
  /^\s*import\s+\(/m,
  /^\s*func\s+\w+\(/m,
];
const JAVA_REGEXES = [
  /\bpublic\s+class\s+\w+/,
  /\bpublic\s+static\s+void\s+main\s*\(/,
  /\bSystem\.out\.println\s*\(/,
];
const RUBY_REGEXES = [
  /^\s*def\s+\w+/m,
  /^\s*class\s+\w+/m,
  /\bputs\s+["']/,
  /:\w+\s*=>/,
];
const RAILS_REGEXES = [
  /\bRails\.application\b/,
  /\bApplicationRecord\b/,
  /\bActiveRecord::Migration\b/,
  /\brender\s+json:/,
];
const SQL_REGEXES = [
  /\bSELECT\b/i,
  /\bINSERT\s+INTO\b/i,
  /\bUPDATE\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bCREATE\s+TABLE\b/i,
  /\bWHERE\b/i,
];
const NOSQL_REGEXES = [
  /\bdb\.\w+\.(find|findOne|insertOne|updateOne|aggregate)\b/,
  /\$set|\$match|\$group|\$project/,
  /\bcollection\(\s*["'][^"']+["']\s*\)/,
];
const SHELL_REGEXES = [
  /^#!\/bin\/(ba)?sh/m,
  /\b(sudo|apt-get|yum|dnf|brew|kubectl|helm|terraform|aws|az|gcloud)\b/,
  /\bexport\s+[A-Z_][A-Z0-9_]*=/,
];
const REACT_NATIVE_REGEXES = [
  /from\s+["']react-native["']/,
  /\bStyleSheet\.create\s*\(/,
  /<(View|Text|Pressable|ScrollView|SafeAreaView)\b/,
];
const FLUTTER_REGEXES = [
  /import\s+["']package:flutter\/[^"']+["']/,
  /\bWidget\s+build\s*\(/,
  /\brunApp\s*\(/,
  /\bMaterialApp\b/,
];
const SWIFT_REGEXES = [
  /\bimport\s+SwiftUI\b/,
  /\bimport\s+Foundation\b/,
  /\bstruct\s+\w+\s*:\s*View\b/,
  /\bfunc\s+\w+\s*\(/,
];

function scoreIfMatch(
  code: string,
  regexes: readonly RegExp[],
  points: number,
) {
  return regexes.reduce(
    (score, regex) => (regex.test(code) ? score + points : score),
    0,
  );
}

function scoreJson(code: string): number {
  const trimmed = code.trim();
  if (!trimmed) return 0;
  if (
    !(
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    )
  ) {
    return 0;
  }
  try {
    JSON.parse(trimmed);
    return 12;
  } catch {
    return 0;
  }
}

function scoreHtml(code: string): number {
  let score = 0;
  if (/<!doctype\s+html>/i.test(code)) score += 8;
  if (/<html[\s>]/i.test(code)) score += 5;
  if (
    /<(head|body|div|span|main|section|article|header|footer|nav)\b/i.test(code)
  ) {
    score += 4;
  }
  if (HTML_TAG_REGEX.test(code)) score += 3;
  return score;
}

function scoreCss(code: string): number {
  let score = 0;
  if (CSS_BLOCK_REGEX.test(code)) score += 6;
  if (CSS_PROP_REGEX.test(code)) score += 4;
  if (/@(media|supports|keyframes|import|layer)\b/.test(code)) score += 3;
  return score;
}

function scoreJsx(code: string): number {
  let score = 0;
  if (JSX_TAG_REGEX.test(code)) score += 6;
  if (/\{[^}]*\}/.test(code)) score += 1;
  if (/className=|onClick=|onChange=|onSubmit=/.test(code)) score += 3;
  return score;
}

function scoreTypeScript(code: string): number {
  let score = scoreIfMatch(code, TS_REGEXES, 3);
  if (/<[A-Z][A-Za-z0-9_,\s]*>/.test(code)) score += 1;
  return score;
}

function scoreJavaScript(code: string): number {
  return JS_KEYWORDS_REGEX.test(code) ? 3 : 1;
}

function scorePython(code: string): number {
  return scoreIfMatch(code, PYTHON_REGEXES, 3);
}

function scoreGo(code: string): number {
  return scoreIfMatch(code, GO_REGEXES, 3);
}

function scoreJava(code: string): number {
  return scoreIfMatch(code, JAVA_REGEXES, 3);
}

function scoreRuby(code: string): number {
  return scoreIfMatch(code, RUBY_REGEXES, 3);
}

function scoreRails(code: string): number {
  return scoreIfMatch(code, RAILS_REGEXES, 4);
}

function scoreSql(code: string): number {
  return scoreIfMatch(code, SQL_REGEXES, 2);
}

function scoreNoSql(code: string): number {
  return scoreIfMatch(code, NOSQL_REGEXES, 3);
}

function scoreShell(code: string): number {
  return scoreIfMatch(code, SHELL_REGEXES, 3);
}

function scoreReactNative(code: string): number {
  return scoreIfMatch(code, REACT_NATIVE_REGEXES, 4);
}

function scoreFlutter(code: string): number {
  return scoreIfMatch(code, FLUTTER_REGEXES, 4);
}

function scoreSwift(code: string): number {
  return scoreIfMatch(code, SWIFT_REGEXES, 3);
}

export function getPopularStackLanguageScores(
  code: string,
): Record<PopularStackLanguage, number> {
  const tsScore = scoreTypeScript(code);
  const jsxScore = scoreJsx(code);
  const rubyScore = scoreRuby(code);
  const railsScore = scoreRails(code);

  return {
    javascript: scoreJavaScript(code),
    typescript: tsScore,
    jsx: jsxScore,
    tsx: tsScore + jsxScore,
    html: scoreHtml(code),
    css: scoreCss(code),
    json: scoreJson(code),
    python: scorePython(code),
    go: scoreGo(code),
    java: scoreJava(code),
    ruby: rubyScore,
    rails: rubyScore + railsScore,
    sql: scoreSql(code),
    nosql: scoreNoSql(code),
    shell: scoreShell(code),
    "react-native": scoreReactNative(code),
    flutter: scoreFlutter(code),
    swift: scoreSwift(code),
  };
}

export function getPriorityPopularStackLanguages(
  code: string,
): PopularStackLanguage[] {
  const scores = getPopularStackLanguageScores(code);

  return [...BASE_PRIORITY].sort((left, right) => {
    const scoreDiff = scores[right] - scores[left];
    if (scoreDiff !== 0) return scoreDiff;
    return BASE_PRIORITY.indexOf(left) - BASE_PRIORITY.indexOf(right);
  });
}

export function detectPopularStackLanguage(
  code: string,
  fallback: PopularStackLanguage = "javascript",
): PopularStackLanguage {
  if (!code.trim()) return fallback;
  const [best] = getPriorityPopularStackLanguages(code);
  return best ?? fallback;
}

export function resolvePopularStackLanguage(
  code: string,
  mode: PopularStackLanguageMode = "auto",
): PopularStackLanguage {
  if (mode === "auto") return detectPopularStackLanguage(code);
  return mode;
}

export function toShikiLanguage(
  language: PopularStackLanguage | string,
): string {
  if (language === "rails") return "ruby";
  if (language === "nosql") return "json";
  if (language === "shell") return "bash";
  if (language === "react-native") return "tsx";
  return language;
}

// Backward-compatible aliases.
export const WEB_STACK_LANGUAGES = POPULAR_STACK_LANGUAGES;
export type WebStackLanguage = PopularStackLanguage;
export type WebStackLanguageMode = PopularStackLanguageMode;
export const getWebStackLanguageScores = getPopularStackLanguageScores;
export const getPriorityWebStackLanguages = getPriorityPopularStackLanguages;
export const detectWebStackLanguage = detectPopularStackLanguage;
export const resolveWebStackLanguage = resolvePopularStackLanguage;
