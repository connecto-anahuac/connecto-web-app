import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/util";

type CellProps = ComponentProps<"div">;

export default function Cell({ className, children, ...props }: CellProps) {
  return (
    <div
      className={cn(
        "flex min-h-9 items-center border border-DividerMiddle bg-Surface px-2.5 text-sm text-OnSurface",
        className,
      )}
      {...props}
    >
      <span className="truncate w-full">{children}</span>
    </div>
  );
}
