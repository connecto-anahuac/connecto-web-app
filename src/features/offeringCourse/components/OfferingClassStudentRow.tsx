import type { ComponentProps } from "react";

import ToggleButton from "@/shared/component/primitive/ToggleButton";
import { cn } from "@/shared/lib/util";

import OfferingClassStudentNameRow from "./OfferingClassStudentNameRow";

type Props = ComponentProps<"div"> & {
  fullName: string;
  avatarColor?: string;
  isSelected?: boolean;
  isEnabled?: boolean;
  onSelectionChange?: (isSelected: boolean) => void;
};

/**
 * Selects a student for an offering class. The student identity is rendered by
 * `OfferingClassStudentNameRow` so it remains consistent anywhere it is used.
 */
export default function OfferingClassStudentRow({
  fullName,
  avatarColor,
  isSelected = true,
  isEnabled = true,
  onSelectionChange,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn("flex h-[26px] w-[218px] items-center justify-between", className)}
      {...props}
    >
      <OfferingClassStudentNameRow fullName={fullName} avatarColor={avatarColor} />
      <ToggleButton
        aria-label={`Select ${fullName}`}
        isEnabled={isEnabled}
        isSelected={isSelected}
        onClick={() => onSelectionChange?.(!isSelected)}
      />
    </div>
  );
}
