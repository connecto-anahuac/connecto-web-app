import type { ComponentProps } from "react";

import CloseIcon from "@/shared/component/primitive/icon/CloseIcon";
import { cn } from "@/shared/lib/util";

type SearchInlineChipProps = ComponentProps<"span"> & {
  label: string;
  removeLabel?: string;
  onRemove?: ComponentProps<"button">["onClick"];
};

export default function SearchInlineChip({
  label,
  removeLabel,
  onRemove,
  className,
  ...props
}: SearchInlineChipProps) {
  return (
    <span
      className={cn(
        "inline-flex h-5 max-w-full shrink-0 items-center gap-1 rounded-full bg-InverseSurface/60 pl-2.5 pr-2 text-sm font-medium text-DividerLowest",
        className,
      )}
      {...props}
    >
      <span className="truncate">{label}</span>
      <button
        type="button"
        aria-label={removeLabel ?? `Remove ${label}`}
        className="inline-flex size-3 p-0.5 shrink-0 items-center justify-center rounded-full bg-DividerLowest text-InverseSurface/60 transition-colors hover:bg-DividerMiddle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Primary/30"
        onClick={onRemove}
      >
        <CloseIcon className="size-full" strokeWidth={4} />
      </button>
    </span>
  );
}
