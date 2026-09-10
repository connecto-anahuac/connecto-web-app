import type { ComponentProps } from "react";

import EstimatedStudentNumber from "@/shared/component/primitive/EstimatedStudentNumber";
import ToggleButton from "@/shared/component/primitive/ToggleButton";
import { cn } from "@/shared/lib/util";

type Props = ComponentProps<"div"> & {
  /** Number displayed in the estimated-student badge. */
  value?: string | number;
  /** Controlled state shared by the badge and switch. */
  isSelected?: boolean;
  /** Whether the switch can be interacted with. */
  isEnabled?: boolean;
  /** Called with the next selected state when the switch is pressed. */
  onToggle?: (isSelected: boolean) => void;
  /** Accessible name for the switch. */
  toggleAriaLabel?: string;
};

/**
 * Pairs the estimated-student badge with its associated enabled-state switch.
 * The selected state is controlled by the parent and kept visually consistent
 * across both primitives.
 */
export default function EstimatedStudentNumberToggle({
  className,
  value = "--",
  isSelected = false,
  isEnabled = true,
  onToggle,
  toggleAriaLabel = "Toggle estimated student number",
  ...props
}: Props) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)} {...props}>
      <EstimatedStudentNumber isSelected={isSelected} value={value} />
      <ToggleButton
        aria-label={toggleAriaLabel}
        isEnabled={isEnabled}
        isSelected={isSelected}
        onClick={() => onToggle?.(!isSelected)}
      />
    </div>
  );
}
