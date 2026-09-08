import type { ComponentProps } from "react";

import PersonIcon from "@/shared/component/primitive/icon/PersonIcon";
import { cn } from "@/shared/lib/util";

type Props = ComponentProps<"div"> & {
  isSelected?: boolean;
  value?: string | number;
};

/** Displays the estimated number of students for a course or semester. */
export default function EstimatedStudentNumber({
  className,
  isSelected = false,
  value = "12",
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "inline-flex  items-center gap-3px rounded-select-fill-left pl-4px pr-7px py-5px text-xs font-medium leading-none",
        isSelected
          ? "bg-PrimaryContainer text-OnPrimaryContainer"
          : "bg-StudentNumberContainer text-OnStudentNumber",
        className,
      )}
      {...props}
    >
      <PersonIcon aria-hidden="true" className="size-3.75" />
      <span className="whitespace-nowrap">{value}</span>
    </div>
  );
}
