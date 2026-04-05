import type { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badge = tv(
  {
    base: ["inline-flex items-center gap-2", "font-mono text-xs"],
    variants: {
      variant: {
        critical: "bg-transparent text-red-accent",
        warning: "bg-transparent text-amber-accent",
        good: "bg-transparent text-green-primary",
        verdict: "bg-transparent text-red-accent",
        info: "bg-transparent text-blue-accent",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
  {
    twMerge: true,
  },
);

const badgeDot = tv(
  {
    base: ["rounded-full"],
    variants: {
      variant: {
        critical: "bg-red-accent",
        warning: "bg-amber-accent",
        good: "bg-green-primary",
        verdict: "bg-red-accent",
        info: "bg-blue-accent",
      },
      size: {
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3 w-3",
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "info",
    },
  },
  {
    twMerge: true,
  },
);

export type BadgeVariantProps = VariantProps<typeof badge>;
export type BadgeProps = BadgeVariantProps &
  Omit<HTMLAttributes<HTMLSpanElement>, "className"> & {
    className?: string;
  };

export type BadgeDotVariantProps = VariantProps<typeof badgeDot>;
export type BadgeDotProps = BadgeDotVariantProps &
  Omit<HTMLAttributes<HTMLSpanElement>, "className"> & {
    className?: string;
  };

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={badge({ variant, className })} {...props}>
      {children}
    </span>
  );
}

function BadgeDot({ className, variant, size, ...props }: BadgeDotProps) {
  return <span className={badgeDot({ variant, size, className })} {...props} />;
}

Badge.displayName = "Badge";
BadgeDot.displayName = "BadgeDot";

export { Badge, BadgeDot, badge, badgeDot };
