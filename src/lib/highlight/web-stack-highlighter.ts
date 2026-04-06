import { createHighlighter, createJavaScriptRegexEngine } from "shiki";
import { SHIKI_THEME } from "./shiki-shared";
import {
  getPriorityPopularStackLanguages,
  type PopularStackLanguage,
  type PopularStackLanguageMode,
  resolvePopularStackLanguage,
  toShikiLanguage,
} from "./web-stack-language";

const highlighterCache = new Map<
  string,
  Promise<Awaited<ReturnType<typeof createHighlighter>>>
>();

function buildLanguageSubset(
  code: string,
  selected: PopularStackLanguageMode,
): string[] {
  const prioritized = getPriorityPopularStackLanguages(code);
  const resolved = resolvePopularStackLanguage(code, selected);

  const ordered =
    prioritized[0] === resolved
      ? prioritized
      : [resolved, ...prioritized.filter((lang) => lang !== resolved)];

  return Array.from(new Set(ordered.map(toShikiLanguage)));
}

async function getWebStackHighlighter(languages: string[]) {
  const cacheKey = languages.join("|");
  const cached = highlighterCache.get(cacheKey);
  if (cached) return cached;

  const next = createHighlighter({
    themes: [SHIKI_THEME],
    langs: languages,
    engine: createJavaScriptRegexEngine(),
  });

  highlighterCache.set(cacheKey, next);
  return next;
}

export interface HighlightWebStackCodeInput {
  code: string;
  languageMode: PopularStackLanguageMode;
}

export interface HighlightWebStackCodeOutput {
  html: string;
  language: PopularStackLanguage;
}

export async function highlightWebStackCode({
  code,
  languageMode,
}: HighlightWebStackCodeInput): Promise<HighlightWebStackCodeOutput> {
  const subset = buildLanguageSubset(code, languageMode);
  const language = resolvePopularStackLanguage(code, languageMode);
  const highlighter = await getWebStackHighlighter(subset);
  const html = highlighter.codeToHtml(code, {
    lang: toShikiLanguage(language),
    theme: SHIKI_THEME,
  });

  return { html, language };
}
