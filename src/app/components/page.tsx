"use client";

import { useState } from "react";
import {
  AnalysisCardDescription,
  AnalysisCardHeader,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/app/components/features/analysis";
import { DiffLine } from "@/app/components/features/diff";
import {
  LeaderboardRow,
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  LeaderboardRowScore,
} from "@/app/components/features/leaderboard";
import { ScoreRing } from "@/app/components/features/score";
import { PageContainer } from "@/app/components/layout";
import { Badge, BadgeDot, Button, Toggle } from "@/components/ui";
import { CodeBlock } from "@/components/ui/code-block";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

export default function ComponentsPage() {
  const [toggleOn, setToggleOn] = useState(false);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-background">
      <PageContainer width="full" className="max-w-[960px] py-16 space-y-16">
        <div className="flex items-center gap-2">
          <span className="text-accent-green font-mono text-4xl font-bold">
            {"//"}
          </span>
          <span className="text-text-primary font-mono text-4xl font-bold">
            component_library
          </span>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              buttons
            </span>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-secondary font-mono text-sm">
                variants
              </span>
            </div>
            <div className="flex flex-wrap gap-4 p-6 bg-card rounded-[radius-md] border border-border-primary">
              <Button variant="primary">{"$ roast_my_code"}</Button>
              <Button variant="secondary">{"$ share_roast"}</Button>
              <Button variant="outline">{"$ view_all >>"}</Button>
              <Button variant="ghost">{"$ ghost"}</Button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-secondary font-mono text-sm">
                sizes
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 p-6 bg-card rounded-[radius-md] border border-border-primary">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">🔍</Button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-secondary font-mono text-sm">
                states
              </span>
            </div>
            <div className="flex flex-wrap gap-4 p-6 bg-card rounded-[radius-md] border border-border-primary">
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="outline" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              badge_status
            </span>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-secondary font-mono text-sm">
                variants
              </span>
            </div>
            <div className="flex flex-wrap gap-6 p-6 bg-card rounded-[radius-md] border border-border-primary">
              <div className="flex items-center gap-2">
                <BadgeDot variant="critical" />
                <Badge variant="critical">critical</Badge>
              </div>
              <div className="flex items-center gap-2">
                <BadgeDot variant="warning" />
                <Badge variant="warning">warning</Badge>
              </div>
              <div className="flex items-center gap-2">
                <BadgeDot variant="good" />
                <Badge variant="good">good</Badge>
              </div>
              <div className="flex items-center gap-2">
                <BadgeDot variant="info" />
                <Badge variant="info">info</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-secondary font-mono text-sm">
                verdict
              </span>
            </div>
            <div className="flex items-center gap-2 p-6 bg-card rounded-[radius-md] border border-border-primary">
              <Badge variant="critical">needs_serious_help</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              toggle
            </span>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-secondary font-mono text-sm">
                states
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-8 p-6 bg-card rounded-[radius-md] border border-border-primary">
              <div className="flex items-center gap-3">
                <Toggle pressed={true} />
                <Badge variant="good">roast mode</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Toggle pressed={false} />
                <Badge variant="info">roast mode</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-secondary font-mono text-sm">
                interactive
              </span>
            </div>
            <div className="flex items-center gap-4 p-6 bg-card rounded-[radius-md] border border-border-primary">
              <Toggle
                pressed={toggleOn}
                onPressedChange={(pressed) => setToggleOn(pressed)}
              />
              <span className="font-mono text-sm text-text-primary">
                {toggleOn ? "roast mode enabled" : "roast mode disabled"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              code_block
            </span>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-secondary font-mono text-sm">
                server_component_with_shiki
              </span>
            </div>
            <div className="rounded-[radius-md] border border-border-primary overflow-hidden">
              <CodeBlock code={sampleCode} language="javascript" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              diff_line
            </span>
          </div>

          <div className="rounded-[radius-md] border border-border-primary overflow-hidden">
            <DiffLine variant="removed" lineNumber={1}>
              var total = 0;
            </DiffLine>
            <DiffLine variant="added" lineNumber={2}>
              const total = 0;
            </DiffLine>
            <DiffLine variant="context" lineNumber={3}>
              {`for (let i = 0; i < items.length; i++)`}
            </DiffLine>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              score_ring
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-8 p-6 bg-card rounded-[radius-md] border border-border-primary">
            <ScoreRing score={3.5} maxScore={10} size="md" />
            <ScoreRing score={7.2} maxScore={10} size="md" />
            <ScoreRing score={9.8} maxScore={10} size="md" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              table_row
            </span>
          </div>

          <div className="rounded-[radius-md] border border-border-primary overflow-hidden">
            <LeaderboardRow rank={1}>
              <LeaderboardRowScore severity="critical">2.1</LeaderboardRowScore>
              <LeaderboardRowCode>
                function calculateTotal(items) {"{..."}
              </LeaderboardRowCode>
              <LeaderboardRowLanguage>javascript</LeaderboardRowLanguage>
            </LeaderboardRow>
            <LeaderboardRow rank={2}>
              <LeaderboardRowScore severity="warning">5.5</LeaderboardRowScore>
              <LeaderboardRowCode>
                const sum = items.reduce((acc, item) =&gt; ...
              </LeaderboardRowCode>
              <LeaderboardRowLanguage>typescript</LeaderboardRowLanguage>
            </LeaderboardRow>
            <LeaderboardRow rank={3}>
              <LeaderboardRowScore severity="good">8.7</LeaderboardRowScore>
              <LeaderboardRowCode>
                export function calculateTotal...
              </LeaderboardRowCode>
              <LeaderboardRowLanguage>typescript</LeaderboardRowLanguage>
            </LeaderboardRow>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              cards
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnalysisCardRoot severity="critical">
              <AnalysisCardHeader>
                <BadgeDot variant="critical" />
                <Badge variant="critical">critical</Badge>
              </AnalysisCardHeader>
              <AnalysisCardTitle>
                using var instead of const/let
              </AnalysisCardTitle>
              <AnalysisCardDescription>
                The var keyword is function-scoped rather than block-scoped,
                which can lead to unexpected behavior and bugs. Modern
                javascript uses const for immutable bindings and let for mutable
                ones.
              </AnalysisCardDescription>
            </AnalysisCardRoot>
            <AnalysisCardRoot severity="warning">
              <AnalysisCardHeader>
                <BadgeDot variant="warning" />
                <Badge variant="warning">warning</Badge>
              </AnalysisCardHeader>
              <AnalysisCardTitle>missing semicolon</AnalysisCardTitle>
              <AnalysisCardDescription>
                While JavaScript can automatically insert semicolons, it&apos;s
                considered best practice to include them explicitly to avoid
                ASI-related bugs.
              </AnalysisCardDescription>
            </AnalysisCardRoot>
            <AnalysisCardRoot severity="good">
              <AnalysisCardHeader>
                <BadgeDot variant="good" />
                <Badge variant="good">good</Badge>
              </AnalysisCardHeader>
              <AnalysisCardTitle>good variable naming</AnalysisCardTitle>
              <AnalysisCardDescription>
                The function name calculateTotal clearly describes what the
                function does.
              </AnalysisCardDescription>
            </AnalysisCardRoot>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
