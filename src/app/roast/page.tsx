"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { InteractiveCodeEditor } from "@/app/components/features/editor/code-editor";
import { PageContainer } from "@/app/components/layout";
import { Button, Toggle } from "@/components/ui";
import {
  CLOUD_PROVIDERS,
  type CloudProvider,
  generateCloudImplementationLines,
} from "@/lib/devops/cloud-implementation-lines";
import {
  type PopularStackLanguageMode,
  resolvePopularStackLanguage,
} from "@/lib/highlight/web-stack-language";
import {
  getLearnedHints,
  updateLearningFromResult,
} from "@/lib/roast/client-memory";
import type { RoastBudgetMode, RoastResult } from "@/lib/roast/types";

export default function RoastPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<PopularStackLanguageMode>("auto");
  const [cloud, setCloud] = useState<CloudProvider>("azure");
  const [budgetMode, setBudgetMode] = useState<RoastBudgetMode>("cheap");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roastMode, setRoastMode] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!code.trim()) return;

    try {
      setError(null);
      setIsSubmitting(true);

      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: resolvedLanguage,
          roastMode,
          budgetMode,
          learnedHints: getLearnedHints(),
        }),
      });

      const data = (await response.json()) as RoastResult & { error?: string };
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate roast.");
      }

      sessionStorage.setItem(
        "devroast.latest",
        JSON.stringify({
          code,
          language: resolvedLanguage,
          result: data,
        }),
      );
      updateLearningFromResult(data);
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const languages = [
    { value: "auto", label: "Auto (Stack Popular)" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "jsx", label: "JSX" },
    { value: "tsx", label: "TSX" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "python", label: "Python" },
    { value: "go", label: "Go" },
    { value: "java", label: "Java" },
    { value: "ruby", label: "Ruby" },
    { value: "rails", label: "Ruby on Rails" },
    { value: "sql", label: "SQL" },
    { value: "nosql", label: "NoSQL" },
    { value: "shell", label: "Shell" },
    { value: "react-native", label: "React Native" },
    { value: "flutter", label: "Flutter" },
    { value: "swift", label: "Swift" },
  ];

  const resolvedLanguage = useMemo(
    () => resolvePopularStackLanguage(code, language),
    [code, language],
  );

  const implementationLines = useMemo(
    () =>
      generateCloudImplementationLines({
        language: resolvedLanguage,
        cloud,
        appName: "devroast-app",
      }),
    [resolvedLanguage, cloud],
  );

  return (
    <main className="min-h-[calc(100vh-56px)] bg-background flex justify-center items-center py-12 lg:py-20">
      <PageContainer className="flex flex-col items-center justify-center w-full max-w-[960px] space-y-12 lg:space-y-16 mx-auto">
        <div className="text-center w-full max-w-3xl space-y-4 md:space-y-6">
          <h1 className="text-3xl lg:text-5xl font-bold font-mono text-foreground">
            <span className="text-accent-green">{"// "}</span>
            detone_meu_codigo
          </h1>
          <p className="text-text-secondary font-mono text-sm">
            cole seu código abaixo e prepare-se para ser julgado
          </p>
        </div>

        <div className="w-full max-w-[840px] flex flex-col items-center space-y-6 md:space-y-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-between w-full px-2 gap-x-6 gap-y-4">
            <div className="flex items-center gap-2">
              <span className="text-text-secondary font-mono text-sm">
                linguagem:
              </span>
              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as PopularStackLanguageMode)
                }
                className="bg-bg-input border border-border-primary rounded-[radius-md] px-3 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary font-mono text-sm">
                nuvem:
              </span>
              <select
                value={cloud}
                onChange={(e) => setCloud(e.target.value as CloudProvider)}
                className="bg-bg-input border border-border-primary rounded-[radius-md] px-3 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CLOUD_PROVIDERS.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary font-mono text-sm">
                orçamento:
              </span>
              <select
                value={budgetMode}
                onChange={(e) =>
                  setBudgetMode(e.target.value as RoastBudgetMode)
                }
                className="bg-bg-input border border-border-primary rounded-[radius-md] px-3 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="cheap">baixo</option>
                <option value="balanced">balanceado</option>
                <option value="deep">profundo</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary font-mono text-sm">
                modo detonação
              </span>
              <Toggle pressed={roastMode} onPressedChange={setRoastMode} />
            </div>
          </div>

          <div className="relative w-full">
            <InteractiveCodeEditor
              value={code}
              onChange={setCode}
              language={language}
              className="w-full"
            />
            <div className="absolute bottom-3 right-3 text-text-tertiary font-mono text-xs z-30 pointer-events-none">
              {code.length} caracteres
            </div>
          </div>

          <div className="w-full rounded-[radius-md] border border-border-primary bg-bg-surface overflow-hidden">
            <div className="px-4 py-3 border-b border-border-primary flex flex-wrap gap-3 items-center text-xs font-mono">
              <span className="text-text-secondary">linhas de implementação:</span>
              <span className="text-accent-green">{resolvedLanguage}</span>
              <span className="text-text-tertiary">via {cloud}</span>
            </div>
            <pre className="p-4 font-mono text-xs text-text-secondary overflow-x-auto leading-6">
              <code>{implementationLines.join("\n")}</code>
            </pre>
          </div>
          {error ? (
            <div className="w-full rounded-[radius-md] border border-red-accent/50 bg-red-accent/10 px-4 py-3 text-xs font-mono text-red-accent">
              {error}
            </div>
          ) : null}
        </div>

        <div className="flex justify-center w-full py-4">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={!code.trim() || isSubmitting}
          >
            {isSubmitting ? "preparando sua avaliação..." : "$ detone_meu_codigo"}
          </Button>
        </div>
      </PageContainer>
    </main>
  );
}
