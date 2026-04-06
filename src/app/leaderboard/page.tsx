"use client";

import Link from "next/link";
import {
  LeaderboardRow,
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  LeaderboardRowScore,
} from "@/app/components/features/leaderboard";
import { ScoreRing } from "@/app/components/features/score";
import { PageContainer } from "@/app/components/layout";
import { Button } from "@/components/ui";

const leaderboardData = [
  {
    rank: 1,
    score: 1.2,
    codePreview:
      "const calculateTotal = (items: Item[]) => items.reduce((sum, item) => sum + item.price, 0);",
    language: "typescript",
    author: "clean_coder_99",
  },
  {
    rank: 2,
    score: 2.8,
    codePreview:
      "function sum(prices) { return prices.reduce((a, b) => a + b, 0); }",
    language: "javascript",
    author: "js_ninja",
  },
  {
    rank: 3,
    score: 4.1,
    codePreview:
      "def calculate_total(items): return sum(item['price'] for item in items)",
    language: "python",
    author: "pythonista",
  },
  {
    rank: 4,
    score: 5.5,
    codePreview:
      "let total = 0; for (let i = 0; i < items.length; i++) { total += items[i].price; }",
    language: "javascript",
    author: "learning_js",
  },
  {
    rank: 5,
    score: 6.3,
    codePreview:
      "function calc(items) { var t = 0; for (var i = 0; i < items.length; i++) { t += items[i].p; }",
    language: "javascript",
    author: "code_newbie",
  },
  {
    rank: 6,
    score: 7.8,
    codePreview:
      "var total = 0; for (var i = 0; i < items.length; i++) { total += items[i].price; }",
    language: "javascript",
    author: "var_enjoyer",
  },
  {
    rank: 7,
    score: 8.9,
    codePreview:
      "var x=0; for (var i=0;i<items.length;i++) { x=x+items[i].price; } return x;",
    language: "javascript",
    author: "minifier_gone_wrong",
  },
];

function getScoreSeverity(score: number): "critical" | "warning" | "good" {
  if (score >= 7) return "good";
  if (score >= 4) return "warning";
  return "critical";
}

export default function LeaderboardPage() {
  const userRank = 42;
  const userScore = 5.8;

  return (
    <main className="min-h-[calc(100vh-56px)] bg-background flex justify-center items-center py-12 lg:py-20">
      <PageContainer className="flex flex-col items-center justify-center w-full max-w-[960px] space-y-12 lg:space-y-16 mx-auto">
        <div className="text-center w-full max-w-3xl space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold font-mono text-foreground">
            <span className="text-accent-green">{"// "}</span>
            leaderboard
          </h1>
          <p className="text-text-secondary font-mono text-xs md:text-sm">
            worst code ranks highest
          </p>
        </div>

        <div className="w-full flex flex-col items-center space-y-8 md:space-y-12">
          <div className="w-full max-w-[780px] bg-card border border-border-primary rounded-[radius-md] p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <ScoreRing score={userScore} maxScore={10} size="md" />
                <div>
                  <div className="font-mono text-text-primary text-sm md:text-base">
                    your_rank
                  </div>
                  <div className="font-mono text-xl md:text-2xl font-bold text-foreground">
                    #{userRank}
                  </div>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="font-mono text-text-secondary text-xs md:text-sm">
                  your_score
                </div>
                <div className="font-mono text-xl md:text-2xl font-bold text-foreground">
                  {userScore}/10
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-xs md:text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-primary font-mono text-xs md:text-sm font-bold">
                top_roasts
              </span>
            </div>

            <div className="w-full max-w-[960px] rounded-[radius-md] border border-border-primary overflow-hidden">
              {leaderboardData.map((entry) => (
                <LeaderboardRow key={entry.rank} rank={entry.rank}>
                  <LeaderboardRowScore severity={getScoreSeverity(entry.score)}>
                    {entry.score.toFixed(1)}
                  </LeaderboardRowScore>
                  <LeaderboardRowCode author={entry.author}>
                    {entry.codePreview}
                  </LeaderboardRowCode>
                  <LeaderboardRowLanguage>
                    {entry.language}
                  </LeaderboardRowLanguage>
                </LeaderboardRow>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/roast">
              <Button className="w-full sm:w-auto">$ try_to_rank_higher</Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
