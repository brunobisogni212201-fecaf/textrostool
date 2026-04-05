import type { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const leaderboardRow = tv(
  {
    base: [
      "flex items-center gap-4 md:gap-6 px-4 md:px-5 py-3 md:py-4",
      "border-b border-border-primary",
    ],
    variants: {},
    defaultVariants: {},
  },
  {
    twMerge: true,
  },
);

const leaderboardRowRank = tv(
  {
    base: ["w-10 shrink-0"],
    variants: {},
    defaultVariants: {},
  },
  {
    twMerge: true,
  },
);

const leaderboardRowScore = tv(
  {
    base: ["w-12 shrink-0 font-mono font-bold"],
    variants: {
      severity: {
        critical: "text-red-accent",
        warning: "text-amber-accent",
        good: "text-green-primary",
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

const leaderboardRowCode = tv(
  {
    base: ["flex-1 min-w-0"],
    variants: {},
    defaultVariants: {},
  },
  {
    twMerge: true,
  },
);

const leaderboardRowLanguage = tv(
  {
    base: [
      "hidden md:block w-24 shrink-0 font-mono text-xs text-text-tertiary",
    ],
    variants: {},
    defaultVariants: {},
  },
  {
    twMerge: true,
  },
);

export type LeaderboardRowVariantProps = VariantProps<typeof leaderboardRow>;
export type LeaderboardRowProps = LeaderboardRowVariantProps &
  Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
    className?: string;
    rank: number;
    children: React.ReactNode;
  };

export type LeaderboardRowRankProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "className"
> & {
  className?: string;
  children: React.ReactNode;
};

export type LeaderboardRowScoreVariantProps = VariantProps<
  typeof leaderboardRowScore
>;
export type LeaderboardRowScoreProps = LeaderboardRowScoreVariantProps &
  Omit<HTMLAttributes<HTMLSpanElement>, "className"> & {
    className?: string;
    children: React.ReactNode;
  };

export type LeaderboardRowCodeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "className"
> & {
  className?: string;
  author?: string;
  children: React.ReactNode;
};

export type LeaderboardRowLanguageProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "className"
> & {
  className?: string;
  children: React.ReactNode;
};

function LeaderboardRow({
  className,
  rank,
  children,
  ...props
}: LeaderboardRowProps) {
  return (
    <div className={leaderboardRow({ className })} {...props}>
      <div className={leaderboardRowRank()}>
        <span className="font-mono text-xs md:text-sm text-text-tertiary">
          #{rank}
        </span>
      </div>
      {children}
    </div>
  );
}

function LeaderboardRowScore({
  className,
  severity = "critical",
  children,
  ...props
}: LeaderboardRowScoreProps) {
  return (
    <span className={leaderboardRowScore({ severity, className })} {...props}>
      {children}
    </span>
  );
}

function LeaderboardRowCode({
  className,
  author,
  children,
  ...props
}: LeaderboardRowCodeProps) {
  return (
    <div className={leaderboardRowCode({ className })} {...props}>
      {author && (
        <span className="font-mono text-xs text-text-tertiary block mb-0.5">
          @{author}
        </span>
      )}
      <span className="font-mono text-xs md:text-sm text-text-secondary truncate block">
        {children}
      </span>
    </div>
  );
}

function LeaderboardRowLanguage({
  className,
  children,
  ...props
}: LeaderboardRowLanguageProps) {
  return (
    <div className={leaderboardRowLanguage({ className })} {...props}>
      {children}
    </div>
  );
}

LeaderboardRow.displayName = "LeaderboardRow";
LeaderboardRowScore.displayName = "LeaderboardRowScore";
LeaderboardRowCode.displayName = "LeaderboardRowCode";
LeaderboardRowLanguage.displayName = "LeaderboardRowLanguage";

export {
  LeaderboardRow,
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  LeaderboardRowScore,
  leaderboardRow,
  leaderboardRowCode,
  leaderboardRowLanguage,
  leaderboardRowScore,
};
