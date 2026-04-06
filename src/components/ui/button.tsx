import type { ButtonHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv(
  {
    base: [
      "inline-flex items-center justify-center gap-2",
      "font-roboto font-semibold transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-green",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "active:scale-[0.98]", // smooth press effect
    ],
    variants: {
      variant: {
        primary:
          "bg-foreground text-background hover:bg-foreground/90 shadow-md",
        secondary:
          "bg-bg-surface border border-border-primary text-foreground hover:bg-bg-elevated hover:border-border-secondary shadow-sm",
        destructive:
          "bg-red-accent/10 border border-red-accent/20 text-red-accent hover:bg-red-accent/20 shadow-sm",
        success:
          "bg-accent-green text-background hover:brightness-110 shadow-md",
        outline:
          "border border-border-primary bg-transparent text-foreground hover:bg-bg-surface shadow-sm",
        ghost:
          "bg-transparent text-foreground hover:bg-bg-surface active:scale-100",
        link: "bg-transparent text-foreground underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        sm: "h-9 px-4 py-2 text-xs rounded-lg",
        md: "h-11 px-6 py-2.5 text-sm rounded-xl",
        lg: "h-12 px-8 text-base rounded-xl",
        icon: "h-11 w-11 rounded-xl",
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
