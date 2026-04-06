"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AnalysisCardDescription,
  AnalysisCardHeader,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/app/components/features/analysis";
import { ScoreRing } from "@/app/components/features/score";
import { PageContainer } from "@/app/components/layout";
import { BadgeDot, Button } from "@/components/ui";
import { CodeBlock } from "@/components/ui/code-block";
import type { RoastResult } from "@/lib/roast/types";

const fallbackCode = `function calculateTotal(items) {
  let total = 0;
  for (const item of items) total += item.price;
  return total;
}`;

const fallbackResult: RoastResult = {
  score: 5,
  totalIssues: 1,
  critical: 0,
  warnings: 1,
  good: 1,
  language: "javascript",
  summary: "Nenhuma avaliação carregada. Faça uma em /roast.",
  findings: [
    {
      severity: "warning",
      title: "Nenhum dado carregado",
      description: "Gere um roast primeiro para ver as avaliações da IA.",
    },
    {
      severity: "good",
      title: "Editor pronto",
      description: "O pipeline está configurado para mostrar resultados do Gemini.",
    },
  ],
  suggestedFixes: ["# vá para /roast e envie um código"],
  meta: {
    model: "n/a",
    budgetMode: "cheap",
    inputTokensEstimate: 0,
    outputTokensLimit: 0,
  },
};

export default function ResultsPage() {
  const [code, setCode] = useState(fallbackCode);
  const [result, setResult] = useState<RoastResult>(fallbackResult);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("devroast.latest");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { code: string; result: RoastResult };
      if (parsed.code && parsed.result) {
        setCode(parsed.code);
        setResult(parsed.result);
      }
    } catch {
      // Keep fallback.
    }
  }, []);

  const findings = useMemo(
    () => result.findings.slice(0, 8),
    [result.findings],
  );

  return (
    <main className="min-h-[calc(100vh-56px)] bg-background flex justify-center items-center py-12 lg:py-20">
      <PageContainer className="flex flex-col w-full max-w-[780px] space-y-12 lg:space-y-16 mx-auto">
        <div className="text-center w-full flex flex-col items-center space-y-4 md:space-y-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold font-mono text-foreground">
            <span className="text-accent-green">{"// "}</span>
            roast_concluido
          </h1>
          <p className="text-text-secondary w-full px-4 font-mono text-sm max-w-2xl text-center pb-2">
            {result.summary}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 w-full pt-4">
            <ScoreRing score={result.score} maxScore={10} size="lg" />
            <div className="text-center sm:text-left flex flex-col justify-center">
              <div className="font-mono text-4xl md:text-5xl font-bold text-foreground">
                {result.score.toFixed(1)}
                <span className="text-2xl md:text-3xl text-text-muted">
                  /10
                </span>
              </div>
              <div className="text-text-primary font-mono text-sm md:text-base font-medium mb-3">
                nota_da_avaliacao
              </div>
              <div className="mt-1 p-3 bg-bg-surface rounded-lg border border-border-primary flex flex-col gap-1 text-[11px] md:text-xs font-mono text-text-tertiary">
                <div>
                  <span className="text-text-muted">modelo:</span>{" "}
                  <span className="text-text-secondary">
                    {result.meta.model}
                  </span>{" "}
                  <span className="text-text-muted">| orçamento:</span>{" "}
                  <span className="text-accent-green">
                    {result.meta.budgetMode}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">tokens:</span>{" "}
                  <span className="text-text-secondary">
                    {result.meta.inputTokensEstimate}
                  </span>{" "}
                  entrada <span className="text-text-muted">| max saída:</span>{" "}
                  <span className="text-text-secondary">
                    {result.meta.outputTokensLimit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4 w-full">
          <div className="bg-card border border-border-primary rounded-[radius-md] p-3 md:p-4 text-center">
            <div className="flex w-full items-center justify-center gap-1.5 md:gap-2 mb-1">
              <BadgeDot variant="critical" />
              <span className="font-mono text-lg md:text-2xl font-bold text-foreground">
                {result.critical}
              </span>
            </div>
            <div className="font-mono text-xs text-text-secondary">
              críticos
            </div>
          </div>
          <div className="bg-card border border-border-primary rounded-[radius-md] p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1">
              <BadgeDot variant="warning" />
              <span className="font-mono text-lg md:text-2xl font-bold text-foreground">
                {result.warnings}
              </span>
            </div>
            <div className="font-mono text-xs text-text-secondary">
              avisos
            </div>
          </div>
          <div className="bg-card border border-border-primary rounded-[radius-md] p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1">
              <BadgeDot variant="good" />
              <span className="font-mono text-lg md:text-2xl font-bold text-foreground">
                {result.good}
              </span>
            </div>
            <div className="font-mono text-xs text-text-secondary">bons</div>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4 w-full">
          <div className="flex w-full items-center gap-2">
            <span className="text-accent-green font-mono text-xs md:text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-xs md:text-sm font-bold">
              seu_codigo
            </span>
          </div>
          <div className="rounded-[radius-md] border border-border-primary overflow-hidden">
            <CodeBlock code={code} language={result.language} />
          </div>
        </div>

        <div className="space-y-3 md:space-y-4 w-full">
          <div className="flex w-full items-center gap-2">
            <span className="text-accent-green font-mono text-xs md:text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-xs md:text-sm font-bold">
              problemas_encontrados
            </span>
          </div>
          <div className="space-y-3">
            {findings.map((finding) => (
              <AnalysisCardRoot
                key={`${finding.severity}-${finding.title}-${finding.description.slice(0, 24)}`}
                severity={finding.severity}
              >
                <AnalysisCardHeader>
                  <BadgeDot variant={finding.severity} />
                  <span className="font-mono text-xs text-text-secondary">
                    {finding.severity}
                  </span>
                </AnalysisCardHeader>
                <AnalysisCardTitle>{finding.title}</AnalysisCardTitle>
                <AnalysisCardDescription>
                  {finding.description}
                </AnalysisCardDescription>
              </AnalysisCardRoot>
            ))}
          </div>
        </div>

        <div className="space-y-3 md:space-y-4 w-full">
          <div className="flex w-full items-center gap-2">
            <span className="text-accent-green font-mono text-xs md:text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-xs md:text-sm font-bold">
              correcoes_sugeridas
            </span>
          </div>
          <div className="rounded-[radius-md] border border-border-primary bg-bg-surface overflow-hidden">
            <pre className="p-4 font-mono text-xs text-text-secondary overflow-x-auto leading-6">
              <code>
                {result.suggestedFixes.join("\n") || "# sem sugestoes"}
              </code>
            </pre>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center w-full gap-3 sm:gap-4">
          <Link href="/roast">
            <Button variant="secondary" className="w-full sm:w-auto">
              $ detonar_outro_codigo
            </Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto">
            $ compartilhar_roast
          </Button>
        </div>
      </PageContainer>
    </main>
  );
}
