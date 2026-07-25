"use client";

import { useMemo, useState } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import CloseButton from "@/components/button/CloseButton";
import SelectMenu from "@/components/selectMenu";
import { FilterCard } from "./filter/FilterCard";
import { FilterFieldHeader } from "./filter/FilterFieldHeader";
import { FilterDefinition, FilterPrimitive } from "../shared/filter-definition";
import { useFilterCondition } from "../shared/use-filter-condition";
import { IconName } from "@/components/icon";

type Props<TItem> = {
  filter: FilterDefinition<TItem>;
    icon?: IconName;
} & ComponentPropsWithRef<"section">;

/**
 * 単一選択フィルター（operator: eq）。
 *　//TODO 使わない？？？？？
 */
export function SelectFilter<TItem>({ filter, icon, ...props }: Props<TItem>) {
  const { condition, operator, setValue, setOperator, clear } =
    useFilterCondition(filter);
  const [hoveredIndex, setHoveredIndex] = useState(0);

  const options = useMemo(
    () =>
      filter.inputType === "option"
        ? filter.options.map((option) => ({
            label: option.label,
            value: String(option.value),
          }))
        : [],
    [filter],
  );

  const valueByKey = useMemo(() => {
    const map = new Map<string, FilterPrimitive>();
    if (filter.inputType === "option") {
      for (const option of filter.options) {
        map.set(String(option.value), option.value);
      }
    }
    return map;
  }, [filter]);

  const selectedValues =
    condition?.value === null || condition?.value === undefined
      ? []
      : [String(condition.value)];

  if (filter.inputType !== "option") {
    return null;
  }

  const selectValue = (key: string) => {
    if (selectedValues.includes(key)) {
      clear();
      return;
    }
    setValue(valueByKey.get(key) ?? key, "eq");
  };

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
      <SelectMenu
        isOpen
        hoveredIndex={hoveredIndex}
        selectedValues={selectedValues}
        onHoverItem={setHoveredIndex}
        onSelectItem={selectValue}
        className="p-0 border-0 bg-transparent"
        options={options}
      />
    </FilterCard>
  );
}