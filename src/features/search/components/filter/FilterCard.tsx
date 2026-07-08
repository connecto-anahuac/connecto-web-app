import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib/util";

type FilterCardProps = HTMLAttributes<HTMLDivElement> & {
  header: ReactNode;
  trailingAction?: ReactNode;
  children: ReactNode;
};

export function FilterCard({
  header,
  trailingAction,
  children,
  className,
  ...props
}: FilterCardProps) {
  return (
    <section
      className={cn(
        "inline-flex min-w-64 w-full flex-col gap-2 rounded-lg border border-Outline bg-Surface px-3 pb-3 pt-2",
        className,
      )}
      {...props}
    >
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">{header}</div>
        {trailingAction ? <div className="shrink-0">{trailingAction}</div> : null}
      </header>

      {children}
    </section>
  );
}