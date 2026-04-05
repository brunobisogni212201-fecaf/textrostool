"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { PageContainer } from "@/components/layout";
import {
  Button,
  LeaderboardRow,
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  LeaderboardRowScore,
  Toggle,
} from "@/components/ui";

const leaderboardPreview = [
  {
    rank: 1,
    score: 1.2,
    codePreview: "const calculateTotal = (items: Item[]) => items.reduce...",
    language: "typescript",
  },
  {
    rank: 2,
    score: 2.8,
    codePreview: "function sum(prices) { return prices.reduce((a, b) =>...",
    language: "javascript",
  },
  {
    rank: 3,
    score: 4.1,
    codePreview: "def calculate_total(items): return sum(item['price']...",
    language: "python",
  },
];

export default function HomePage() {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roastMode, setRoastMode] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lineCount = code.split("\n").length || 1;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    window.location.href = "/results";
  };

  return (
    <main className="min-h-[calc(100vh-56px)] bg-background">
      <PageContainer
        width="full"
        className="pt-16 lg:pt-20 pb-8 space-y-8 lg:space-y-12"
      >
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <span className="text-accent-green font-mono text-3xl lg:text-5xl font-bold">
              $
            </span>
            <h1 className="font-mono text-3xl lg:text-5xl font-bold text-foreground">
              paste your code. get roasted.
            </h1>
          </div>
          <p className="text-text-secondary font-mono text-sm lg:text-base">
            {"//"} drop your code below and we&apos;ll rate it — brutally honest
            or full roast mode
          </p>
        </div>

        {/* Code Editor */}
        <div className="w-full max-w-[780px] mx-auto space-y-3">
          <div className="rounded-[radius-md] border border-border-primary overflow-hidden">
            {/* Window Header */}
            <div className="h-10 bg-bg-surface border-b border-border-primary flex items-center gap-2 px-4">
              <div className="w-3 h-3 rounded-full bg-red-accent" />
              <div className="w-3 h-3 rounded-full bg-amber-accent" />
              <div className="w-3 h-3 rounded-full bg-accent-green" />
            </div>

            {/* Code Area with Line Numbers */}
            <div className="flex h-[360px] bg-bg-input">
              {/* Line Numbers */}
              <div
                ref={lineNumbersRef}
                className="w-12 bg-bg-surface border-r border-border-primary overflow-hidden select-none"
              >
                <div className="py-4 px-3 flex flex-col gap-2">
                  {lineNumbers.map((num) => (
                    <span
                      key={num}
                      className="font-mono text-xs text-text-tertiary text-right leading-[1.375rem]"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onScroll={handleScroll}
                  placeholder="// paste your terrible code here..."
                  className="w-full h-full bg-transparent p-4 font-mono text-xs lg:text-sm text-foreground placeholder:text-text-tertiary focus:outline-none resize-none"
                  spellCheck={false}
                  style={{ tabSize: 2 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="w-full max-w-[780px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Toggle pressed={roastMode} onPressedChange={setRoastMode} />
            <span className="text-text-tertiary font-mono text-xs">
              {"//"} maximum sarcasm enabled
            </span>
          </div>
          <Button
            variant="success"
            size="lg"
            className="w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={!code.trim() || isSubmitting}
          >
            {isSubmitting ? "preparing..." : "$ roast_my_code"}
          </Button>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-center gap-6">
          <span className="text-text-tertiary font-mono text-xs">
            2,847 codes roasted
          </span>
          <span className="text-text-tertiary font-mono text-xs">·</span>
          <span className="text-text-tertiary font-mono text-xs">
            avg score: 4.2/10
          </span>
        </div>

        {/* Leaderboard Preview */}
        <div className="w-full max-w-[960px] mx-auto space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-xs lg:text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-primary font-mono text-xs lg:text-sm font-bold">
                shame_leaderboard
              </span>
            </div>
            <Link
              href="/leaderboard"
              className="text-text-secondary hover:text-text-primary font-mono text-xs lg:text-sm transition-colors"
            >
              view_all &rarr;
            </Link>
          </div>

          <div className="rounded-[radius-md] border border-border-primary overflow-hidden">
            {leaderboardPreview.map((entry) => (
              <LeaderboardRow key={entry.rank} rank={entry.rank}>
                <LeaderboardRowScore
                  severity={
                    entry.score < 2
                      ? "critical"
                      : entry.score < 4
                        ? "warning"
                        : "good"
                  }
                >
                  {entry.score.toFixed(1)}
                </LeaderboardRowScore>
                <LeaderboardRowCode>{entry.codePreview}</LeaderboardRowCode>
                <LeaderboardRowLanguage>
                  {entry.language}
                </LeaderboardRowLanguage>
              </LeaderboardRow>
            ))}
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
