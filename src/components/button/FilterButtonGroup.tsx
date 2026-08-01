"use client";

import { useState, type ComponentProps } from "react";
import type {
  DataViewConfig,
  DataViewMetadata,
} from "../table/dataView.types";
import { cn } from "@/shared/lib/util";
import Button from "./Button";
import FilterButton from "./FilterButton";

type Props<TItem> = ComponentProps<"div"> & {
  config: DataViewConfig<TItem>;
  metadata: DataViewMetadata;
};

export default function FilterButtonGroup<TItem>({
  className,
  config,
  metadata,
  ...props
}: Props<TItem>) {
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
      {config.fields
        .filter((column) => column.filterable !== false)
        .map((column) => (
          <FilterButton
            key={column.fieldId}
            column={column}
            options={metadata.optionsByFieldId[column.fieldId] ?? []}
            open={openedId === column.fieldId}
            onOpenChange={(open) => setOpenedId(open ? column.fieldId : null)}
          />
        ))}
      <Button
        icon="plus"
        label="Añadir"
        intent="darkInk"
        appearance="text"
        size="md"
        className="shrink-0"
      />
      
          {/* scroll margin */}
          <div className="w-4/5 shrink-0"/>
    </div>
  );
}
