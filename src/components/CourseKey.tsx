import { cn } from "@/shared/lib/util";
import React from "react";

type Props = {
  code: string;
  number: string | number;
  color?: string;
  className?: string;
};

export default function CourseKey({
  code,
  number,
  className = "",
}: Props) {
  return (
    <div
      className={cn(
        `inline-flex items-center rounded-md border border-[#595959] text-xs overflow-hidden`,
        className,
      )}
      style={{ borderColor: `var(--${code}-strong)` }}
    >
      <div
        className="shrink-0 px-0.75 pr-0.5 py-px bg-[#595959] " // text-white
        style={{ backgroundColor: `var(--${code}-strong)` }}
      >
        {code}
      </div>
      <div className="px-1 text-[#2d2d2d] ">{number}</div>
    </div>
  );
}
