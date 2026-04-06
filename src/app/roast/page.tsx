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

export default function RoastPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<PopularStackLanguageMode>("auto");
  const [cloud, setCloud] = useState<CloudProvider>("azure");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roastMode, setRoastMode] = useState(true);

  const handleSubmit = async () => {
    if (!code.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    router.push("/results");
  };

  const languages = [
    { value: "auto", label: "Auto (Popular Stack)" },
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
            roast_my_code
          </h1>
          <p className="text-text-secondary font-mono text-sm">
            paste your code below and prepare to be roasted
          </p>
        </div>

        <div className="w-full max-w-[780px] flex flex-col items-center space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full px-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-text-secondary font-mono text-sm">
                language:
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
                cloud:
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
                roast mode
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
              {code.length} chars
            </div>
          </div>

          <div className="w-full rounded-[radius-md] border border-border-primary bg-bg-surface overflow-hidden">
            <div className="px-4 py-3 border-b border-border-primary flex flex-wrap gap-3 items-center text-xs font-mono">
              <span className="text-text-secondary">implementation lines:</span>
              <span className="text-accent-green">{resolvedLanguage}</span>
              <span className="text-text-tertiary">via {cloud}</span>
            </div>
            <pre className="p-4 font-mono text-xs text-text-secondary overflow-x-auto leading-6">
              <code>{implementationLines.join("\n")}</code>
            </pre>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={!code.trim() || isSubmitting}
          >
            {isSubmitting ? "preparing your roast..." : "$ roast_my_code"}
          </Button>
        </div>
      </PageContainer>
    </main>
  );
}
