"use client";

import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/util";

type Props = ComponentProps<"button"> & {
  selected?: boolean;
};

export default function SearchPresetChip({
  className,
  selected = false,
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "px-2 py-0.5 text-xs rounded-full font-semibold",
        "hover:opacity-80",
        "border border-OnSurface/60 bg-transparent text-OnSurface/60",
        selected && "bg-Secondary text-OnSecondary border-none",
        className,
      )}
      aria-pressed={selected}
      {...props}
    >
      {children}
    </button>
  );
}
