import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/util";

type ToggleButtonProps = Omit<ComponentProps<"button">, "disabled"> & {
  /** Whether the control is on. */
  isSelected?: boolean;
  /** Renders the compact indicator variant used for multi-select controls. */
  isMulti?: boolean;
  /** Enables interaction and selects the enabled visual state. */
  isEnabled?: boolean;
  /** @deprecated Use isEnabled. Kept for parity with the Figma component API. */
  isEnable?: boolean;
};

/**
 * A controlled, accessible switch matching the Toggle component in the design
 * system. State changes are owned by the parent through `isSelected` and
 * `onClick`.
 */
export default function ToggleButton({
  className,
  isSelected = false,
  isMulti = false,
  isEnabled,
  isEnable,
  "aria-label": ariaLabel = "Toggle",
  type = "button",
  ...props
}: ToggleButtonProps) {
  const enabled = isEnabled ?? isEnable ?? true;

  return (
    <button
      {...props}
      aria-checked={isSelected}
      aria-label={ariaLabel}
      className={cn(
        "flex h-4 w-8 items-center rounded-[45px] p-1 transition-colors",
        isSelected
          ? enabled
            ? "justify-end bg-Primary"
            : "justify-end bg-PrimaryContainer"
          : enabled
            ? "justify-start bg-GrayLow"
            : "justify-start bg-DividerMiddle",
        enabled
          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Primary focus-visible:ring-offset-2"
              : "cursor-not-allowed",
         isMulti && "justify-center" ,
        className,
      )}
      disabled={!enabled}
      role="switch"
      type={type}
    >
      <span
        aria-hidden="true"
        className={cn("w-3.5 shrink-0 rounded-full bg-OnPrimary", isMulti ? "h-1" : "h-2")}
      />
    </button>
  );
}
