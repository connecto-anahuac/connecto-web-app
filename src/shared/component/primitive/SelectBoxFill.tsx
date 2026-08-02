import type { ReactNode } from "react";

import Arrow from "@/shared/component/primitive/icon/Arrow";
import { cn } from "@/shared/lib/util";
import { IconName, Icons } from "./icon";

type SelectBoxFillSize = "small" | "middle";

interface SelectBoxFillProps {
  value: string;
  size?: SelectBoxFillSize;
  leadingIcon?: IconName;
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
}

const sizeStyles: Record<
  SelectBoxFillSize,
  {
    container: string;
    label: string;
    icon: string;
    chevron: string;
  }
> = {
  small: {
    container: "h-6",
    label: "text-xs font-normal",
    icon: "size-3",
    chevron: "size-4",
  },
  middle: {
    container: "h-7",
    label: "text-sm font-medium",
    icon: "size-3",
    chevron: "size-4",
  },
};

export default function SelectBoxFill({
  value,
  size = "small",
  leadingIcon,
  className,
  labelClassName,
  triggerClassName,
}: SelectBoxFillProps) {
  const styles = sizeStyles[size];
  const IconComponent = leadingIcon ? Icons[leadingIcon] : undefined;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-px text-OnSurface",
        styles.container,
        className,
      )}
    >
      <div
        className={cn(
          "inline-flex h-full items-center rounded-select-fill-left bg-DividerLow ",
          leadingIcon ? "gap-1 pl-4px pr-7px py-5px" : "px-7px",
        )}
      >
        {IconComponent && (
            <IconComponent className="size-4" />
        )}
        <span
          className={cn(
            "leading-none whitespace-nowrap",
            styles.label,
            labelClassName,
          )}
        >
          {value}
        </span>
      </div>

      <button
        type="button"
        aria-label={`${value} options`}
        className={cn(
          "inline-flex h-full w-6 items-center justify-center rounded-select-fill-right bg-DividerLow px-1 text-OnSurface",
          triggerClassName,
        )}
      >
        <Arrow className={styles.chevron} direction="down" />
      </button>
    </div>
  );
}
