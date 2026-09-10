"use client";

import type { ComponentPropsWithRef } from "react";
import CloseButton from "@/shared/component/primitive/button/CloseButton";
import type { DataFieldConfig } from "@/shared/types/dataView.types";
import { cn } from "@/shared/lib/util";
import type { Operator } from "../../../../service/dataPipeline/operatorPolicy";
import { FilterCard } from "../FilterCard";
import { FilterFieldHeader } from "../FilterFieldHeader";

type Props<TItem> = ComponentPropsWithRef<"section"> & {
  column: DataFieldConfig<TItem>;
  operator: Operator;
  value: number | null;
  onClose: () => void;
  onOperatorChange: (operator: Operator) => void;
  onValueChange: (value: number | null) => void;
};

export function NumberFilter<TItem>({
  column,
  operator,
  value,
  onClose,
  onOperatorChange,
  onValueChange,
  ...props
}: Props<TItem>) {
  return (
    <FilterCard
      {...props}
      aria-label={`${column.label} filter`}
      header={
        <FilterFieldHeader
          column={column}
          operator={operator}
          onOperatorChange={onOperatorChange}
        />
      }
      trailingAction={<CloseButton onClick={onClose} />}
    >
      <input
        aria-label={column.label}
        placeholder={column.label}
        type="number"
        value={value ?? ""}
        onChange={(event) => {
          const raw = event.target.value;
          onValueChange(raw === "" ? null : Number(raw));
        }}
        className={cn(
          "h-9 w-full rounded-sm border border-Outline bg-gray-400/20 p-2 text-sm leading-none font-normal text-OnSurfaceVariant outline-none",
          "focus:border-2 focus:border-Primary focus:bg-SurfaceContainerLow",
        )}
      />
    </FilterCard>
  );
}
