import { highlightCodeRsc } from "@/lib/highlight/rsc-highlighter";

export type CodeBlockProps = {
  code: string;
  language?: string;
  className?: string;
};

export async function CodeBlock({
  code,
  language = "javascript",
  className,
}: CodeBlockProps) {
  const html = await highlightCodeRsc(code, language);

  return (
    <div
      className={`rounded-[radius-md] border border-border bg-bg-input overflow-hidden ${className || ""}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is safe
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
