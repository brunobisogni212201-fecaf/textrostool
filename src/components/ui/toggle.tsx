"use client";

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { tv, type VariantProps } from "tailwind-variants";

const toggleTrack = tv(
  {
    base: [
      "relative inline-flex shrink-0 cursor-pointer rounded-full items-center",
      "transition-colors duration-200 ease-in-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
    ],
    variants: {
      size: {
        sm: "h-5 w-9 px-0.5",
        md: "h-6 w-11 px-[3px]",
        lg: "h-7 w-14 px-1",
      },
      state: {
        on: "bg-accent-green",
        off: "bg-bg-input border border-border-primary",
      },
    },
    defaultVariants: {
      size: "md",
      state: "off",
    },
  },
  {
    twMerge: true,
  },
);

const toggleKnob = tv(
  {
    base: [
      "rounded-full bg-white shadow-sm ring-0 block",
      "transform transition-transform duration-200 ease-in-out",
    ],
    variants: {
      size: {
        sm: "h-4 w-4 data-[state=on]:translate-x-[16px] data-[state=off]:translate-x-0",
        md: "h-4.5 w-4.5 data-[state=on]:translate-x-[20px] data-[state=off]:translate-x-0",
        lg: "h-5 w-5 data-[state=on]:translate-x-[28px] data-[state=off]:translate-x-0",
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
        const isPressed = state.pressed;
        const trackClasses = toggleTrack({ size, state: isPressed ? "on" : "off" });
        const knobClasses = toggleKnob({ size });

        return (
          <button
            type="button"
            {...toggleProps}
            aria-checked={isPressed}
            className={`inline-flex items-center gap-3 cursor-pointer focus-visible:outline-none rounded-full ${className || ""}`}
          >
            <span
              className={trackClasses}
              data-state={isPressed ? "on" : "off"}
            >
              <span
                className={knobClasses}
                data-state={isPressed ? "on" : "off"}
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
