import type { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const analysisCardRoot = tv(
  {
    base: ["rounded-[radius-md] border border-border bg-card p-5"],
    variants: {
      severity: {
        critical: "border-l-2 border-l-red-accent",
        warning: "border-l-2 border-l-amber-accent",
        good: "border-l-2 border-l-green-primary",
      },
    },
    defaultVariants: {
      severity: "critical",
    },
  },
  {
    twMerge: true,
  },
);

const analysisCardHeader = tv(
  {
    base: ["flex items-center gap-2 font-mono text-xs"],
    variants: {},
    defaultVariants: {},
  },
  {
    twMerge: true,
  },
);

const analysisCardTitle = tv(
  {
    base: ["font-mono text-sm text-foreground mt-3"],
    variants: {},
    defaultVariants: {},
  },
  {
    twMerge: true,
  },
);

const analysisCardDescription = tv(
  {
    base: ["font-mono text-xs text-muted-foreground mt-3 leading-relaxed"],
    variants: {},
    defaultVariants: {},
  },
  {
    twMerge: true,
  },
);

export type AnalysisCardRootVariantProps = VariantProps<
  typeof analysisCardRoot
>;
export type AnalysisCardRootProps = AnalysisCardRootVariantProps &
  Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
    className?: string;
  };

export type AnalysisCardHeaderProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "className"
> & {
  className?: string;
};

export type AnalysisCardTitleProps = Omit<
  HTMLAttributes<HTMLParagraphElement>,
  "className"
> & {
  className?: string;
};

export type AnalysisCardDescriptionProps = Omit<
  HTMLAttributes<HTMLParagraphElement>,
  "className"
> & {
  className?: string;
};

function AnalysisCardRoot({
  className,
  severity = "critical",
  children,
  ...props
}: AnalysisCardRootProps) {
  return (
    <div className={analysisCardRoot({ severity, className })} {...props}>
      {children}
    </div>
  );
}

function AnalysisCardHeader({
  className,
  children,
  ...props
}: AnalysisCardHeaderProps) {
  return (
    <div className={analysisCardHeader({ className })} {...props}>
      {children}
    </div>
  );
}

function AnalysisCardTitle({
  className,
  children,
  ...props
}: AnalysisCardTitleProps) {
  return (
    <p className={analysisCardTitle({ className })} {...props}>
      {children}
    </p>
  );
}

function AnalysisCardDescription({
  className,
  children,
  ...props
}: AnalysisCardDescriptionProps) {
  return (
    <p className={analysisCardDescription({ className })} {...props}>
      {children}
    </p>
  );
}

AnalysisCardRoot.displayName = "AnalysisCardRoot";
AnalysisCardHeader.displayName = "AnalysisCardHeader";
AnalysisCardTitle.displayName = "AnalysisCardTitle";
AnalysisCardDescription.displayName = "AnalysisCardDescription";

export {
  AnalysisCardDescription,
  AnalysisCardHeader,
  AnalysisCardRoot,
  AnalysisCardTitle,
  analysisCardDescription,
  analysisCardHeader,
  analysisCardRoot,
  analysisCardTitle,
};
