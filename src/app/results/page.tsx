"use client";

import Link from "next/link";
import {
  AnalysisCardDescription,
  AnalysisCardHeader,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/app/components/features/analysis";
import { DiffLine } from "@/app/components/features/diff";
import { ScoreRing } from "@/app/components/features/score";
import { PageContainer } from "@/app/components/layout";
import { BadgeDot, Button } from "@/components/ui";
import { CodeBlock } from "@/components/ui/code-block";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const roastResults = {
  score: 3.2,
  totalIssues: 4,
  critical: 1,
  warnings: 2,
  good: 1,
  language: "javascript",
};

export default function ResultsPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-background flex justify-center items-center py-12 lg:py-20">
      <PageContainer className="flex flex-col w-full max-w-[780px] space-y-12 lg:space-y-16 mx-auto">
        <div className="text-center w-full flex flex-col items-center space-y-4 md:space-y-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold font-mono text-foreground">
            <span className="text-accent-green">{"// "}</span>
            roast_complete
          </h1>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-4 sm:gap-6">
            <ScoreRing score={roastResults.score} maxScore={10} size="lg" />
            <div className="text-left">
              <div className="font-mono text-xl md:text-2xl font-bold text-foreground">
                {roastResults.score}/10
              </div>
              <div className="text-text-secondary font-mono text-xs md:text-sm">
                roast_score
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4 w-full">
          <div className="bg-card border border-border-primary rounded-[radius-md] p-3 md:p-4 text-center">
            <div className="flex w-full items-center justify-center gap-1.5 md:gap-2 mb-1">
              <BadgeDot variant="critical" />
              <span className="font-mono text-lg md:text-2xl font-bold text-foreground">
                {roastResults.critical}
              </span>
            </div>
            <div className="font-mono text-xs text-text-secondary">
              critical
            </div>
          </div>
          <div className="bg-card border border-border-primary rounded-[radius-md] p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1">
              <BadgeDot variant="warning" />
              <span className="font-mono text-lg md:text-2xl font-bold text-foreground">
                {roastResults.warnings}
              </span>
            </div>
            <div className="font-mono text-xs text-text-secondary">
              warnings
            </div>
          </div>
          <div className="bg-card border border-border-primary rounded-[radius-md] p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1">
              <BadgeDot variant="good" />
              <span className="font-mono text-lg md:text-2xl font-bold text-foreground">
                {roastResults.good}
              </span>
            </div>
            <div className="font-mono text-xs text-text-secondary">good</div>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4 w-full">
          <div className="flex w-full items-center gap-2">
            <span className="text-accent-green font-mono text-xs md:text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-xs md:text-sm font-bold">
              your_code
            </span>
          </div>
          <div className="rounded-[radius-md] border border-border-primary overflow-hidden">
            <CodeBlock code={sampleCode} language={roastResults.language} />
          </div>
        </div>

        <div className="space-y-3 md:space-y-4 w-full">
          <div className="flex w-full items-center gap-2">
            <span className="text-accent-green font-mono text-xs md:text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-xs md:text-sm font-bold">
              roast_findings
            </span>
          </div>
          <div className="space-y-3">
            <AnalysisCardRoot severity="critical">
              <AnalysisCardHeader>
                <BadgeDot variant="critical" />
                <span className="font-mono text-xs text-red-accent">
                  critical
                </span>
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
                <span className="font-mono text-xs text-amber-accent">
                  warning
                </span>
              </AnalysisCardHeader>
              <AnalysisCardTitle>missing semicolon</AnalysisCardTitle>
              <AnalysisCardDescription>
                While JavaScript can automatically insert semicolons, it&apos;s
                considered best practice to include them explicitly to avoid
                ASI-related bugs.
              </AnalysisCardDescription>
            </AnalysisCardRoot>
            <AnalysisCardRoot severity="warning">
              <AnalysisCardHeader>
                <BadgeDot variant="warning" />
                <span className="font-mono text-xs text-amber-accent">
                  warning
                </span>
              </AnalysisCardHeader>
              <AnalysisCardTitle>use forEach or map instead</AnalysisCardTitle>
              <AnalysisCardDescription>
                Classic for loops are more error-prone. Consider using forEach
                for iteration or map if you need to transform the array.
              </AnalysisCardDescription>
            </AnalysisCardRoot>
            <AnalysisCardRoot severity="good">
              <AnalysisCardHeader>
                <BadgeDot variant="good" />
                <span className="font-mono text-xs text-green-primary">
                  good
                </span>
              </AnalysisCardHeader>
              <AnalysisCardTitle>good variable naming</AnalysisCardTitle>
              <AnalysisCardDescription>
                The variable names total and items are clear and descriptive.
              </AnalysisCardDescription>
            </AnalysisCardRoot>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4 w-full">
          <div className="flex w-full items-center gap-2">
            <span className="text-accent-green font-mono text-xs md:text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-xs md:text-sm font-bold">
              suggested_fixes
            </span>
          </div>
          <div className="rounded-[radius-md] border border-border-primary overflow-hidden">
            <DiffLine variant="removed" lineNumber={1}>
              var total = 0;
            </DiffLine>
            <DiffLine variant="added" lineNumber={1}>
              const total = 0;
            </DiffLine>
            <DiffLine variant="removed" lineNumber={3}>
              for (var i = 0; i {"<"} items.length; i++) &#123;
            </DiffLine>
            <DiffLine variant="added" lineNumber={3}>
              items.forEach((item) ={">"} &#123;
            </DiffLine>
            <DiffLine variant="added" lineNumber={4}>
              total += item.price;
            </DiffLine>
            <DiffLine variant="added" lineNumber={5}>
              &#125;);
            </DiffLine>
            <DiffLine variant="removed" lineNumber={5}>
              total += items[i].price;
            </DiffLine>
            <DiffLine variant="removed" lineNumber={6}>
              &#125;
            </DiffLine>
            <DiffLine variant="removed" lineNumber={7}>
              return total;
            </DiffLine>
            <DiffLine variant="added" lineNumber={7}>
              return total;
            </DiffLine>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center w-full gap-3 sm:gap-4">
          <Link href="/roast">
            <Button variant="secondary" className="w-full sm:w-auto">
              $ roast_another
            </Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto">
            $ share_roast
          </Button>
        </div>
      </PageContainer>
    </main>
  );
}
