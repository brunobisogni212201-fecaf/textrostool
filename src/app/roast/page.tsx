"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageContainer } from "@/components/layout";
import { Button, Toggle } from "@/components/ui";
import { CodeBlock } from "@/components/ui/code-block";

export default function RoastPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
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
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "rust", label: "Rust" },
    { value: "go", label: "Go" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
  ];

  return (
    <main className="min-h-[calc(100vh-56px)] bg-background">
      <PageContainer className="pt-16 lg:pt-20 pb-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl lg:text-5xl font-bold font-mono text-foreground">
            <span className="text-accent-green">{"// "}</span>
            roast_my_code
          </h1>
          <p className="text-text-secondary font-mono text-sm">
            paste your code below and prepare to be roasted
          </p>
        </div>

        <div className="w-full max-w-[780px] mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-text-secondary font-mono text-sm">
                language:
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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
                roast mode
              </span>
              <Toggle pressed={roastMode} onPressedChange={setRoastMode} />
            </div>
          </div>

          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// paste your terrible code here..."
              className="w-full h-64 md:h-80 lg:h-[300px] bg-bg-input border border-border-primary rounded-[radius-md] p-3 lg:p-4 font-mono text-xs lg:text-sm text-foreground placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              spellCheck={false}
            />
            <div className="absolute bottom-3 right-3 text-text-tertiary font-mono text-xs">
              {code.length} chars
            </div>
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

        {code && (
          <div className="w-full max-w-[780px] mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-xs lg:text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-secondary font-mono text-xs lg:text-sm">
                preview
              </span>
            </div>
            <div className="rounded-[radius-md] border border-border-primary overflow-hidden">
              <CodeBlock
                code={code || "// your code will appear here"}
                language={language}
              />
            </div>
          </div>
        )}
      </PageContainer>
    </main>
  );
}
