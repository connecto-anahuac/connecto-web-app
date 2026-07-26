"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import CloseButton from "@/components/button/CloseButton";
import { cn } from "@/shared/lib/util";
import { FilterCard } from "./FilterCard";
import { FilterFieldHeader } from "./FilterFieldHeader";
import { FilterDefinition } from "../../shared/filterDefinition";
import { useFilterCondition } from "../../shared/useFilterCondition";
import { IconName } from "@/components/icon";

type Props<TItem> = {
  filter: FilterDefinition<TItem>;
    icon?: IconName;
} & ComponentPropsWithRef<"section">;

/**
 * 日付フィルター（operator: eq / gt / gte / lt / lte / between）。
 */
export function DateFilter<TItem>({ filter, icon, ...props }: Props<TItem>) {
  const { condition, operator, setValue, setOperator, clear } =
    useFilterCondition(filter);

  const value = typeof condition?.value === "string" ? condition.value : "";

  return (
    <FilterCard
      {...props}
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
        type="date"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className={cn(
          "h-9 w-full rounded-sm border border-Outline bg-gray-400/20 p-2 text-sm leading-none font-normal text-OnSurfaceVariant outline-none",
          "focus:border-2 focus:border-Primary focus:bg-SurfaceContainerLow",
        )}
      />
    </FilterCard>
  );
}