"use client";

import type { Table } from "@tanstack/react-table";
import { useState, type ComponentProps } from "react";
import { cn } from "@/shared/lib/util";
import type { DataViewConfig } from "../table/dataView.types";
import { TanstackFilterButton } from "./TanstackFilterButton";

type TanstackFilterButtonGroupProps<TItem> = ComponentProps<"div"> & {
  table: Table<TItem>;
  config: DataViewConfig<TItem>;
};

/** Renders filterable DataViewConfig columns as TanStack Table filter controls. */
export function TanstackFilterButtonGroup<TItem>({
  table,
  config,
  className,
  ...props
}: TanstackFilterButtonGroupProps<TItem>) {
  const [openedId, setOpenedId] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "flex items-center min-w-0 gap-2 scrollbar-none",
        openedId ? "overflow-x-hidden" : "overflow-x-auto",
        className,
      )}
      {...props}
    >
      {config.columns
        .filter((columnConfig) => columnConfig.filterable !== false)
        .map((columnConfig) => {
          const column = table.getColumn(columnConfig.id);
          if (!column) return null;

          return (
            <TanstackFilterButton
              column={column}
              config={columnConfig}
              key={columnConfig.id}
              open={openedId === columnConfig.id}
              onOpenChange={(open) =>
                setOpenedId(open ? columnConfig.id : null)
              }
            />
          );
        })}
          {/* scroll margin */}
          <div className="w-4/5 shrink-0"/>
    </div>
  );
}
