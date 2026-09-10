"use client";

import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/util";
import { IconName, Icons } from "../icon";

type ToggleButtonProps = ComponentProps<"button"> & {
  isSelected?: boolean;
  label: string;
  icon?: IconName;
  hasBadge?: boolean;
  isEnabled?: boolean;
};

export default function ToggleButton({
  className,
  isSelected = false,
  hasBadge = false,
  label,
  icon,
  isEnabled = true,
  ...props
}: ToggleButtonProps) {
  const iconSrc = isSelected
    ? "https://www.figma.com/api/mcp/asset/ddfc4357-b367-45f8-98a8-ba922aca050f"
    : "https://www.figma.com/api/mcp/asset/510c2dc0-390f-426f-9fbd-3ec6b93d03fb";

  const badgeSrc =
    "https://www.figma.com/api/mcp/asset/eddfa504-11d7-4ed1-9bca-d0773e597a5d";

  const IconComponent = icon ? Icons[icon] : null;

  return (
    <button
      className={cn(
        // Layout and sizing
        "relative h-6 flex items-center gap-0.5 px-2 py-1 rounded-md",
        icon && "pl-1",
        // Unselected state
        "bg-transparent text-OnSurface font-normal",
        // Selected state
        isSelected && "bg-InverseSurface text-InverseOnSurface font-medium",
        // Typography
        "text-sm  whitespace-nowrap leading-none",
        // Interaction
        "transition-colors hover:bg-DividerLow",
        isSelected && "hover:bg-InverseSurface/80",
        !isEnabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
        className,
      )}
      {...props}
    >
      {/* Icon */}
      {IconComponent && <IconComponent className="w-5 h-5 shrink-0" />}

      {/* Label */}
      {label && <span>{label}</span>}

      {/* Badge */}
      {hasBadge && (
        //TODO border color -real bg color?????
        //temporally containerlowest
        <div className="border-2 border-SurfaceContainerLowest  absolute size-3 -top-1 -right-1 bg-Tertiary rounded-full" />
      )}
    </button>
  );
}
