import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/util";

type HeaderCellProps = ComponentProps<"div"> & {
  label?: ReactNode;
  trailing?: ReactNode;
};

export default function HeaderCellBase({
  label,
  trailing,
  children,
  className,
  ...props
}: HeaderCellProps) {
  const content = children ?? label;

  return (
    <div
      className={cn(
        "flex h-9 items-center border border-DividerMiddle bg-DividerLowest px-2.5 text-xs font-medium text-OnSurfaceVariant",
        trailing ? "justify-between gap-2" : "justify-start",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1 truncate">{content}</div>
      {trailing ? <div className="shrink-0 text-OnSurfaceVariant">{trailing}</div> : null}
    </div>
  );
}
