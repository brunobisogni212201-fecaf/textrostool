"use client";

import type { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLine = tv(
  {
    base: ["flex items-center gap-2 px-4 py-2 font-mono text-xs"],
    variants: {
      variant: {
        removed: "bg-[#1A0A0A] text-red-accent",
        added: "bg-[#0A1A0F] text-green-primary",
        context: "bg-transparent text-text-secondary",
      },
    },
    defaultVariants: {
      variant: "context",
    },
  },
  {
    twMerge: true,
  },
);

const diffPrefix = tv(
  {
    base: ["w-4 shrink-0 select-none"],
    variants: {
      variant: {
        removed: "text-red-accent",
        added: "text-green-primary",
        context: "text-text-tertiary",
      },
    },
    defaultVariants: {
      variant: "context",
    },
  },
  {
    twMerge: true,
  },
);

export type DiffLineVariantProps = VariantProps<typeof diffLine>;
export type DiffLineProps = DiffLineVariantProps &
  Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
    className?: string;
    lineNumber?: number;
    children: React.ReactNode;
  };

function DiffLine({
  className,
  variant = "context",
  lineNumber,
  children,
  ...props
}: DiffLineProps) {
  const prefix = variant === "added" ? "+" : variant === "removed" ? "-" : " ";

  return (
    <div className={diffLine({ variant, className })} {...props}>
      <span className={diffPrefix({ variant })}>{prefix}</span>
      <span className="text-text-tertiary w-6">{lineNumber}</span>
      <span>{children}</span>
    </div>
  );
}

DiffLine.displayName = "DiffLine";

export { DiffLine, diffLine };
