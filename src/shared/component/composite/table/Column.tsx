import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/util";

type ColumnProps = ComponentProps<"div">;

export default function Column({ className, ...props }: ColumnProps) {
  return <div className={cn("flex min-w-0 flex-col", className)} {...props} />;
}
