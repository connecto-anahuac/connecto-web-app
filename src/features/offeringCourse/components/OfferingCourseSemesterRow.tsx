import type { ComponentProps } from "react";

import EstimatedStudentNumber from "@/shared/component/primitive/EstimatedStudentNumber";
import ToggleButton from "@/shared/component/primitive/ToggleButton";
import TriangleArrowIcon from "@/shared/component/primitive/icon/TriangleArrowIcon";
import { cn } from "@/shared/lib/util";

type Props = ComponentProps<"div"> & {
  semesterLabel: string;
  studentCount: number;
  isMulti?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (isSelected: boolean) => void;
  showLeadingArrow?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export default function OfferingCourseSemesterRow({
  semesterLabel,
  studentCount,
  isMulti = false,
  isSelected = false,
  onSelectionChange,
  showLeadingArrow = true,
  isOpen = true,
  onOpenChange,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn("flex h-[49px] w-[260px] items-center gap-1 text-OnStudentNumber", className)}
      {...props}
    >
      {showLeadingArrow ? (
        <button
          type="button"
          className="flex w-2.5 items-center justify-center text-OnStudentNumber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary"
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Collapse" : "Expand"} semester ${semesterLabel}`}
          onClick={() => onOpenChange?.(!isOpen)}
        >
          <TriangleArrowIcon
            className={cn("size-6 shrink-0 transition-transform", isOpen && "rotate-90")}
          />
        </button>
      ) : (
        <div className="w-2.5" aria-hidden="true" />
      )}

      <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md py-3">
        <span className="w-20 shrink-0 text-xs font-medium">{semesterLabel}</span>
        <EstimatedStudentNumber
          isSelected={isSelected}
          value={studentCount}
        />
        {/* <div className="h-px min-w-0 flex-1 bg-DividerMiddle" aria-hidden="true" /> */}
        <ToggleButton
          className="ml-auto"
          aria-label={`Select ${semesterLabel}`}
          isMulti={isMulti}
          isSelected={isSelected}
          onClick={() => onSelectionChange?.(!isSelected)}
        />
      </div>
    </div>
  );
}
