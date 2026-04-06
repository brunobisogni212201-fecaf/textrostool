import { getSingletonHighlighter } from "shiki";
import { SHIKI_THEME } from "./shiki-shared";
import { toShikiLanguage } from "./web-stack-language";

function escapeHtml(code: string) {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function highlightCodeRsc(code: string, language: string) {
  try {
    const shikiLanguage = toShikiLanguage(language);
    const highlighter = await getSingletonHighlighter({
      themes: [SHIKI_THEME],
      langs: [shikiLanguage],
    });

    return highlighter.codeToHtml(code, {
      lang: shikiLanguage,
      theme: SHIKI_THEME,
    });
  } catch {
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}
