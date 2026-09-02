"use client";

import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/util";
import { AlertLevel } from "@/shared/types/consts";

type Props = ComponentProps<"div"> & {
  status: AlertLevel;
  value: string;
};

export default function ProgressDiffChip({
  className,
  status,
  value,
  ...props
}: Props) {
  

  return (
    <div
      className={cn(
        "px-1 py-1 text-xs rounded-sm font-medium flex gap-0 items-baseline",
        // "hover:opacity-80",
        // "border border-OnSurface/60 bg-transparent text-OnSurface/60",
        // "bg-Secondary text-OnSecondary border-none",
        status === "high" && "bg-AlertHigh text-OnAlertHigh",
        status === "medium" && "bg-AlertMedium text-OnAlertMedium",
        status === "low" && "bg-AlertLow text-OnAlertLow",
        // status === "bad" && "bg-StatusBad text-OnStatusBad",
        // status === "worst" && "bg-StatusWorst text-OnStatusWorst",
        className,
      )}
      {...props}
    >
      <span className="text-base font-medium leading-none">{value}</span>
      <span className="font-black text-sm leading-none">%</span>
    </div>
  );
}
