"use client";

import type { ReactNode } from "react";
import CloseButton from "@/components/button/CloseButton";
import { cn } from "@/shared/lib/util";
import { FilterCard } from "./FilterCard";
import { FilterFieldHeader } from "./FilterFieldHeader";
import { FilterDefinition } from "../../shared/filter-definition";
import { useFilterCondition } from "../../shared/use-filter-condition";

type Props<TItem> = {
  filter: FilterDefinition<TItem>;
  icon?: ReactNode;
};

/**
 * 数値フィルター（operator: eq / gt / gte / lt / lte / between / in）。
 */
export function NumberFilter<TItem>({ filter, icon }: Props<TItem>) {
  const { condition, operator, setValue, setOperator, clear } =
    useFilterCondition(filter);

  const value = typeof condition?.value === "number" ? String(condition.value) : "";

  return (
    <FilterCard
      aria-label={`${filter.label} filter`}
      header={
        <FilterFieldHeader
          filter={filter}
          icon={icon}
          operator={operator}
          onOperatorChange={setOperator}
        />
      }
      trailingAction={<CloseButton onClick={clear} />}
    >
      <input
        aria-label={filter.label}
        placeholder={filter.label}
        type="number"
        value={value}
        onChange={(event) => {
          const raw = event.target.value;
          setValue(raw === "" ? null : Number(raw));
        }}
        className={cn(
          "h-9 w-full rounded-sm border border-Outline bg-gray-400/20 p-2 text-sm leading-none font-normal text-OnSurfaceVariant outline-none",
          "focus:border-2 focus:border-Primary focus:bg-SurfaceContainerLow",
        )}
      />
    </FilterCard>
  );
}