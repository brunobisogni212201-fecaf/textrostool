"use client";

import type { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const scoreRingContainer = tv({
  base: ["relative inline-flex items-center justify-center"],
  variants: {
    size: {
      md: "w-32 h-32",
      lg: "w-40 h-40",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

const scoreRingCenter = tv({
  base: ["flex flex-col items-center justify-center z-10"],
  variants: {
    size: {
      md: "gap-0.5",
      lg: "gap-1",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

const scoreRingText = tv({
  base: ["font-mono font-bold text-foreground leading-none"],
  variants: {
    size: {
      md: "text-4xl",
      lg: "text-5xl",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

const scoreRingSubtext = tv({
  base: ["font-mono text-text-tertiary"],
  variants: {
    size: {
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export type ScoreRingProps = HTMLAttributes<HTMLDivElement> & {
  score: number;
  maxScore?: number;
  size?: "md" | "lg";
};

const sizeToPixels: Record<string, number> = {
  md: 128,
  lg: 160,
};

function ScoreRing({
  className,
  score,
  maxScore = 10,
  size = "lg",
  ...props
}: ScoreRingProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const pixelSize = sizeToPixels[size];
  const circumference = 2 * Math.PI * (pixelSize / 2 - 10);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const scoreColor =
    percentage >= 70 ? "green" : percentage >= 40 ? "amber" : "red";

  const gradientId = `score-gradient-${Math.random().toString(36).substr(2, 9)}`;

  const colorMap: Record<string, { start: string; end: string }> = {
    green: { start: "#22c55e", end: "#22c55e" },
    amber: { start: "#22c55e", end: "#f59e0b" },
    red: { start: "#22c55e", end: "#ef4444" },
  };

  const colors = colorMap[scoreColor];

  return (
    <div
      className={scoreRingContainer({ size, className })}
      style={{ width: pixelSize, height: pixelSize }}
      {...props}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        className="absolute inset-0 -rotate-90"
        aria-label={`Score: ${score} out of ${maxScore}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            <stop
              offset={
                scoreColor === "red"
                  ? "10%"
                  : scoreColor === "amber"
                    ? "35%"
                    : "70%"
              }
              stopColor={colors.end}
            />
            <stop offset="36%" stopColor="transparent" />
          </linearGradient>
        </defs>

        <circle
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={pixelSize / 2 - 10}
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth="4"
        />

        <circle
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={pixelSize / 2 - 10}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      <div className={scoreRingCenter({ size })}>
        <span className={scoreRingText({ size })}>{score.toFixed(1)}</span>
        <span className={scoreRingSubtext({ size })}>/{maxScore}</span>
      </div>
    </div>
  );
}

ScoreRing.displayName = "ScoreRing";

export { ScoreRing, scoreRingCenter, scoreRingContainer };
