"use client";

import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/util";
import { AlertLevel } from "@/shared/types/consts";

type Props = ComponentProps<"div"> & {
  status?: AlertLevel;
};

export default function AlertChip({ className, status, ...props }: Props) {
  let label = "";
  switch (status) {
    case "high":
      label = "Alerto";
      break;
    case "medium":
      label = "Precaución";
      break;
    case "low":
      label = "Bueno";
      break;
    default:
      label = "";
  }

  return (
    <div
      className={cn(
        "px-2 py-0.5 text-xs rounded-full font-medium",
        // "hover:opacity-80",
        // "border border-OnSurface/60 bg-transparent text-OnSurface/60",
        "bg-Secondary text-OnSecondary border-none",
        status === "high" && "bg-AlertHigh text-OnAlertHigh",
        status === "medium" && "bg-AlertMedium text-OnAlertMedium",
        status === "low" && "bg-AlertLow text-OnAlertLow",
        // status === "bad" && "bg-StatusBad text-OnStatusBad",
        // status === "worst" && "bg-StatusWorst text-OnStatusWorst",
        className,
      )}
      {...props}
    >
      {label}
    </div>
  );
}
