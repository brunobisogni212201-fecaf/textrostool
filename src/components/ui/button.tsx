import type { ButtonHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv(
  {
    base: [
      "inline-flex items-center justify-center gap-2",
      "font-mono font-medium transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
      "disabled:opacity-50 disabled:cursor-not-allowed",
    ],
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground enabled:hover:bg-primary/90 enabled:active:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground enabled:hover:bg-secondary/80 enabled:active:bg-secondary/70",
        destructive:
          "bg-destructive text-destructive-foreground enabled:hover:bg-destructive/90 enabled:active:bg-destructive/80",
        success:
          "bg-[#10B981] text-[#0A0A0A] enabled:hover:bg-[#0D9668] enabled:active:bg-[#0A8A5C]",
        outline:
          "border border-border bg-transparent text-foreground enabled:hover:bg-accent enabled:active:bg-accent/80",
        ghost:
          "bg-transparent text-foreground enabled:hover:bg-accent enabled:active:bg-accent/80",
        link: "bg-transparent text-primary underline-offset-4 hover:underline focus-visible:ring-offset-0",
      },
      size: {
        sm: "h-8 px-3 py-1.5 text-xs rounded-[radius-md]",
        md: "h-10 px-4 py-2.5 text-sm rounded-[radius-md]",
        lg: "h-11 px-6 text-sm rounded-[radius-lg]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
  {
    twMerge: true,
  },
);

export type ButtonVariantProps = VariantProps<typeof button>;
export type ButtonProps = ButtonVariantProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "target" | "rel"> & {
    target?: "_self" | "_blank" | "_parent" | "_top";
    rel?: string;
  };

function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <button className={button({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}

Button.displayName = "Button";

export { Button, button };
