"use client";

import Link from "next/link";
import { useState } from "react";
import { InteractiveCodeEditor } from "@/app/components/features/editor/code-editor";
import { PageContainer } from "@/app/components/layout";
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

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    window.location.href = "/results";
  };

  return (
    <main className="min-h-[calc(100vh-56px)] bg-background flex justify-center items-center py-12 lg:py-20">
      <PageContainer
        width="full"
        className="flex flex-col items-center justify-center w-full max-w-[960px] space-y-12 lg:space-y-24 mx-auto"
      >
        {/* Hero Section */}
        <div className="text-center w-full max-w-3xl space-y-4 md:space-y-6">
          <div className="flex items-center justify-center gap-3">
            <span className="text-accent-green font-mono text-3xl lg:text-5xl font-bold">
              $
            </span>
            <h1 className="font-mono text-3xl lg:text-5xl font-bold text-foreground">
              Análise de código por IA
            </h1>
          </div>
          <p className="text-text-secondary font-mono text-sm lg:text-base">
            {"//"} Cole seu código abaixo para receber dicas de otimização, boas práticas
            e melhorias de segurança de forma rápida e precisa.
          </p>
        </div>

        {/* Code Editor */}
        <div className="w-full w-full max-w-[780px] flex flex-col items-center">
          <InteractiveCodeEditor
            value={code}
            onChange={setCode}
            language="javascript"
            className="w-full"
          />
        </div>

        {/* Actions Bar */}
        <div className="w-full max-w-[780px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Toggle pressed={roastMode} onPressedChange={setRoastMode} />
            <span className="text-text-tertiary font-mono text-xs">
              {"//"} avaliação rigorosa ativada
            </span>
          </div>
          <Button
            variant="success"
            size="lg"
            className="w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={!code.trim() || isSubmitting}
          >
            {isSubmitting ? "preparando..." : "Analisar código"}
          </Button>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-center gap-6">
          <span className="text-text-tertiary font-mono text-xs">
            2.847 códigos otimizados
          </span>
          <span className="text-text-tertiary font-mono text-xs">·</span>
          <span className="text-text-tertiary font-mono text-xs">
            pontuação média: 7.2/10
          </span>
        </div>

        {/* Leaderboard Preview */}
        <div className="w-full max-w-[780px] flex flex-col items-center space-y-8 pt-8 lg:pt-12">
          <div className="flex w-full items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-xs lg:text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-primary font-mono text-xs lg:text-sm font-semibold">
                ranking da comunidade
              </span>
            </div>
            <Link
              href="/leaderboard"
              className="text-text-secondary hover:text-text-primary font-mono text-xs lg:text-sm transition-colors"
            >
              ver todos &rarr;
            </Link>
          </div>

          <div className="w-full rounded-[radius-md] border border-border-primary overflow-hidden">
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
