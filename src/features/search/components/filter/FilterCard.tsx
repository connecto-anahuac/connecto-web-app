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
        "search-filter-card inline-flex w-search-filter-card flex-col gap-2 rounded-search-filter-card border border-Outline bg-Surface px-3 py-3",
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