"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import CloseButton from "@/components/button/CloseButton";
import { FilterCard } from "./FilterCard";
import { FilterSearchInput } from "./FilterSearchInput";
import { FilterFieldHeader } from "./FilterFieldHeader";
import { FilterDefinition } from "../../shared/filterDefinition";
import { useFilterCondition } from "../../shared/useFilterCondition";
import { IconName } from "@/components/icon";

type Props<TItem> = {
  filter: FilterDefinition<TItem>;
  icon?: IconName;
} & ComponentPropsWithRef<"section">;

/**
 * 自由入力テキストフィルター（operator: eq / contains / in）。
 */
export function TextFilter<TItem>({ filter, icon, ...props }: Props<TItem>) {
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
      <FilterSearchInput
        aria-label={filter.label}
        placeholder={filter.label}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onClear={clear}
      />
    </FilterCard>
  );
}