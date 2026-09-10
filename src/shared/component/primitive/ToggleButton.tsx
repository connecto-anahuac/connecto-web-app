import { useState, type ComponentProps } from "react";
import { cn } from "@/shared/lib/util";

type ToggleButtonProps = Omit<ComponentProps<"button">, "disabled"> & {
  /** Initial value when the component is uncontrolled. */
  defaultSelected?: boolean;
  /** Whether the control is on. */
  isSelected?: boolean;
  /** Renders the compact indicator variant used for multi-select controls. */
  isMulti?: boolean;
  /** Enables interaction and selects the enabled visual state. */
  isEnabled?: boolean;
  /** @deprecated Use isEnabled. Kept for parity with the Figma component API. */
  isEnable?: boolean;
  /** Called with the requested value. Controlled consumers must update isSelected. */
  onSelectedChange?: (isSelected: boolean) => void;
};

/**
 * An accessible switch matching the Toggle component in the design system.
 * `isSelected` makes the control controlled; otherwise it keeps its own value.
 */
export default function ToggleButton({
  className,
  defaultSelected,
  isSelected,
  isMulti = false,
  isEnabled,
  isEnable,
  onSelectedChange,
  "aria-label": ariaLabel = "Toggle",
  type = "button",
  onClick,
  ...props
}: ToggleButtonProps) {
  const enabled = isEnabled ?? isEnable ?? true;
  const [uncontrolledSelected, setUncontrolledSelected] = useState(
    defaultSelected ?? isSelected ?? false,
  );
  const selected = isSelected ?? uncontrolledSelected;

  const handleClick: ComponentProps<"button">["onClick"] = (event) => {
    if (enabled) {
      const nextSelected = !selected;
      if (isSelected === undefined) setUncontrolledSelected(nextSelected);
      onSelectedChange?.(nextSelected);
    }

    onClick?.(event);
  };

  return (
    <button
      {...props}
      aria-checked={selected}
      aria-label={ariaLabel}
      className={cn(
        "flex h-4 w-8 items-center rounded-[45px] p-1 transition-colors",
        selected
          ? enabled
            ? "justify-end bg-Primary"
            : "justify-end bg-PrimaryContainer"
          : enabled
            ? "justify-start bg-GrayLow"
            : "justify-start bg-DividerMiddle",
        enabled
          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Primary focus-visible:ring-offset-2"
              : "cursor-not-allowed",
        isMulti && "justify-center",
        className,
      )}
      disabled={!enabled}
      onClick={handleClick}
      role="switch"
      type={type}
    >
      <span
        aria-hidden="true"
        className={cn(
          "w-3.5 shrink-0 rounded-full bg-OnPrimary",
          isMulti ? "h-1" : "h-2",
        )}
      />
    </button>
  );
}
