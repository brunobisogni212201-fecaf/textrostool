"use client";

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { tv, type VariantProps } from "tailwind-variants";

const toggleTrack = tv(
  {
    base: [
      "relative inline-flex shrink-0 cursor-pointer rounded-full",
      "transition-colors duration-200 ease-in-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
    ],
    variants: {
      size: {
        sm: "h-5 w-9 p-[3px]",
        md: "h-6 w-11 p-[3px]",
        lg: "h-7 w-13 p-[4px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
  {
    twMerge: true,
  },
);

const toggleKnob = tv(
  {
    base: [
      "rounded-full bg-white shadow-md",
      "transform transition-transform duration-200 ease-in-out",
    ],
    variants: {
      size: {
        sm: "h-3.5 w-3.5",
        md: "h-4.5 w-4.5",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
  {
    twMerge: true,
  },
);

export type ToggleVariantProps = VariantProps<typeof toggleTrack>;
export type ToggleProps = ToggleVariantProps & {
  className?: string;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
};

function Toggle({
  className,
  pressed,
  defaultPressed,
  onPressedChange,
  disabled,
  size,
  ...props
}: ToggleProps) {
  return (
    <BaseToggle
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
      disabled={disabled}
      render={(toggleProps, state) => {
        const trackClasses = toggleTrack({ size });
        const knobClasses = toggleKnob({ size });
        const isPressed = state.pressed;

        return (
          <button
            type="button"
            {...toggleProps}
            className={`inline-flex items-center gap-3 cursor-pointer ${className || ""}`}
          >
            <span
              className={`${trackClasses} ${isPressed ? "bg-green-primary" : "bg-border-primary"}`}
            >
              <span
                className={`${knobClasses} ${isPressed ? "translate-x-[18px]" : "translate-x-0"}`}
              />
            </span>
          </button>
        );
      }}
      {...props}
    />
  );
}

Toggle.displayName = "Toggle";

export { Toggle };
