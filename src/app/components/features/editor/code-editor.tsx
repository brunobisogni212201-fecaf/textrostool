"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { highlightWebStackCode } from "@/lib/highlight/web-stack-highlighter";
import type { WebStackLanguageMode } from "@/lib/highlight/web-stack-language";

export interface InteractiveCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: WebStackLanguageMode;
  placeholder?: string;
  className?: string;
}

// Strip background color explicitly so parent container bg shines through
// and remove margins so overlay works perfectly
const highlightCodeStyleClear = (htmlStr: string) => {
  return htmlStr
    .replace(
      /background-color:#[a-zA-Z0-9]+;?/,
      "background-color:transparent;",
    )
    .replace(/<pre /, '<pre style="margin:0;padding:0;" ');
};

export function InteractiveCodeEditor({
  value,
  onChange,
  language = "auto",
  placeholder = "// paste your terrible code here...",
  className = "",
}: InteractiveCodeEditorProps) {
  const [html, setHtml] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync scroll
  const handleScroll = useCallback(() => {
    if (textareaRef.current) {
      const { scrollTop, scrollLeft } = textareaRef.current;
      if (codeRef.current) {
        codeRef.current.scrollTop = scrollTop;
        codeRef.current.scrollLeft = scrollLeft;
      }
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }
    }
  }, []);

  useEffect(() => {
    if (!value) {
      setHtml("");
      return;
    }

    const highlightCode = async () => {
      try {
        const highlighted = await highlightWebStackCode({
          code: value,
          languageMode: language,
        });
        setHtml(highlightCodeStyleClear(highlighted.html));
      } catch (_err) {
        // Fallback to simple escape if language is missing
        setHtml(
          `<pre style="background:transparent;margin:0;padding:0;"><code>${value
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</code></pre>`,
        );
      }
    };

    // Debounce highligh to keep typing fast
    const timer = setTimeout(highlightCode, 150);
    return () => clearTimeout(timer);
  }, [value, language]);

  // Line calculations for line numbers
  const lineCount = value.split("\n").length || 1;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div
      className={`relative flex flex-col h-[360px] bg-bg-input rounded-[radius-md] border border-border-primary overflow-hidden ${className}`}
    >
      {/* Window Header */}
      <div className="h-10 bg-bg-surface border-b border-border-primary flex items-center gap-2 px-4 shrink-0 z-20">
        <div className="w-3 h-3 rounded-full bg-red-accent" />
        <div className="w-3 h-3 rounded-full bg-amber-accent" />
        <div className="w-3 h-3 rounded-full bg-accent-green" />
      </div>

      <div className="flex flex-1 relative min-h-0 overflow-hidden">
        {/* Line Numbers Sidebar */}
        <div
          ref={lineNumbersRef}
          className="w-12 bg-bg-surface border-r border-border-primary overflow-hidden select-none flex-shrink-0"
        >
          <div className="py-4 px-3 flex flex-col">
            {lineNumbers.map((num) => (
              <span
                key={num}
                className="font-mono text-xs text-text-tertiary text-right leading-[24px] h-[24px]"
              >
                {num}
              </span>
            ))}
          </div>
        </div>

        {/* Editor Content Area */}
        <div className="flex-1 relative overflow-hidden bg-bg-input">
          {/* Placeholder text logic since text is transparent on textarea */}
          {!value && (
            <div className="absolute inset-0 p-4 pointer-events-none font-mono text-xs lg:text-sm text-text-tertiary leading-[24px]">
              {placeholder}
            </div>
          )}

          {/* Highlighted Code (Base Layer - Z: 0) */}
          <div
            ref={codeRef}
            className="absolute inset-0 overflow-auto whitespace-pre font-mono text-xs lg:text-sm p-4 w-full h-full pointer-events-none z-0"
            aria-hidden="true"
          >
            <div
              className="w-fit min-w-full leading-[24px]"
              style={{ tabSize: 2 }}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is safe
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>

          {/* Textarea (Overlay - Z: 10) */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            className="absolute inset-0 w-full h-full p-4 font-mono text-xs lg:text-sm bg-transparent outline-none resize-none overflow-auto z-10 text-transparent caret-white"
            spellCheck={false}
            style={{ lineHeight: "24px", tabSize: 2 }}
          />
        </div>
      </div>
    </div>
  );
}
