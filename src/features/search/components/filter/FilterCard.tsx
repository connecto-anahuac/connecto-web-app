import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "@/shared/lib/util";

type FilterCardProps = ComponentPropsWithRef<"section"> & {
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
        "inline-flex min-w-64 w-fit flex-col gap-2 rounded-lg border-2 border-OutlineVariant bg-Surface px-3 pb-3 pt-2",
        className,
      )}
      {...props}
    >
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">{header}</div>
        {trailingAction ? (
          <div className="shrink-0">{trailingAction}</div>
        ) : null}
      </header>
      {children}
    </section>
  );
}
