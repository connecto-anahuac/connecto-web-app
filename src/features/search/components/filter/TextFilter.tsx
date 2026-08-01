"use client";

import type { ComponentPropsWithRef } from "react";
import CloseButton from "@/components/button/CloseButton";
import type { DataFieldConfig } from "@/components/table/dataView.types";
import type { Operator } from "../../shared/operatorPolicy";
import { FilterCard } from "./FilterCard";
import { FilterFieldHeader } from "./FilterFieldHeader";
import { FilterSearchInput } from "./FilterSearchInput";

type Props<TItem> = ComponentPropsWithRef<"section"> & {
  column: DataFieldConfig<TItem>;
  operator: Operator;
  value: string;
  onClear: () => void;
  onOperatorChange: (operator: Operator) => void;
  onValueChange: (value: string) => void;
};

export function TextFilter<TItem>({
  column,
  operator,
  value,
  onClear,
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
      trailingAction={<CloseButton onClick={onClear} />}
    >
      <FilterSearchInput
        aria-label={column.label}
        placeholder={column.label}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onClear={onClear}
      />
    </FilterCard>
  );
}
