"use client";

import type { ComponentProps } from "react";
import { useState } from "react";

import { cn } from "@/shared/lib/util";

type CellProps = ComponentProps<"button"> & {
  isSelected?: boolean;
};

export default function SearchPresetChip({
  className,
  isSelected: isSelectedProp = false,
  children,
  onClick,
  ...props
}: CellProps) {
  const [isSelected, setIsSelected] = useState(isSelectedProp);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsSelected((prev) => !prev);
    onClick?.(e);
  };

  return (
    <button
      className={cn(
        "px-2 py-0.5 text-xs rounded-full font-semibold",
        "hover:opacity-80",
        "border border-OnSurface/60 bg-transparent text-OnSurface/60",
        isSelected && "bg-Secondary text-OnSecondary border-none",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
