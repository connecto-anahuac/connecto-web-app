"use client";

import type { ComponentPropsWithRef } from "react";
import CloseButton from "@/shared/component/primitive/button/CloseButton";
import type { DataFieldConfig } from "@/shared/types/dataView.types";
import type { Operator } from "../../../../service/dataPipeline/operatorPolicy";
import { FilterCard } from "../FilterCard";
import { FilterFieldHeader } from "../FilterFieldHeader";
import { FilterSearchInput } from "../filterinput/FilterSearchInput";

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
