import type { ButtonHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv(
  {
    base: [
      "inline-flex items-center justify-center gap-2",
      "font-roboto font-medium transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-green",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "active:scale-[0.98]", // smooth press effect
    ],
    variants: {
      variant: {
        primary:
          "bg-foreground text-background hover:bg-foreground/90",
        secondary:
          "bg-bg-surface border border-border-primary text-foreground hover:bg-bg-elevated hover:border-border-focus",
        destructive:
          "bg-red-accent/10 border border-red-accent/20 text-red-accent hover:bg-red-accent/20",
        success:
          "bg-accent-green text-background hover:brightness-110",
        outline:
          "border border-border-primary bg-transparent text-foreground hover:bg-bg-surface",
        ghost:
          "bg-transparent text-foreground hover:bg-bg-surface active:scale-100",
        link: "bg-transparent text-foreground underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        sm: "h-7 px-3 text-xs rounded-sm",
        md: "h-8 px-4 text-[13px] rounded",
        lg: "h-9 px-5 text-sm rounded",
        icon: "h-8 w-8 rounded",
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
