import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/util";
import { IconName, Icons } from "./icon";

export type NavigationItemTone = "sub" | "root";

type Props = ComponentProps<"div"> & {
  icon?: IconName;
  label?: string;
  selected?: boolean;
  tone?: NavigationItemTone;
  hasLabel?: boolean;
};

export function NavigationItem({
  className,
  icon,
  label = "materias ofertadas",
  selected = false,
  tone = "sub",
  hasLabel = true,
  ...props
}: Props) {
  const showLabel = hasLabel && label.length > 0;
  const IconComponent = icon && Icons[icon];

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md py-2 text-xs leading-none",
        "text-OnSurfaceVariant font-medium",
        "px-nav-left",
        // showLabel ? "pl-1 pr-1.5" : "px-1.5",
        "justify-center",
        showLabel && " pr-1.5 justify-start",
        !selected && "hover:bg-PrimaryContainer/20",
        selected && "bg-PrimaryContainerLow text-OnPrimaryContainerLow",
        // /!selected && "opacity-[0.84]",
        className,
      )}
      {...props}
    >
      <span className="flex size-4.5 shrink-0 items-center justify-center text-current">
        {IconComponent && <IconComponent />}
      </span>

      <span
        className={cn(
          "whitespace-nowrap text-xs leading-none",
          !showLabel && "hidden",
          // selected && isRoot ? "font-semibold text-[#BC5F2F]" : "font-medium text-[#53433E]",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default NavigationItem;
