import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const pageContainer = tv(
  {
    base: ["w-full mx-auto px-6 lg:px-10"],
    variants: {
      width: {
        sm: "max-w-3xl",
        md: "max-w-4xl",
        lg: "max-w-5xl",
        xl: "max-w-6xl",
        full: "max-w-7xl",
      },
    },
    defaultVariants: {
      width: "lg",
    },
  },
  {
    twMerge: true,
  },
);

type PageContainerVariantProps = VariantProps<typeof pageContainer>;

type PageContainerProps = HTMLAttributes<HTMLDivElement> &
  PageContainerVariantProps;

const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, width, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={pageContainer({ width, className })}
        {...props}
      />
    );
  },
);

PageContainer.displayName = "PageContainer";

export type { PageContainerProps, PageContainerVariantProps };
export { PageContainer, pageContainer };
