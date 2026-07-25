"use client";

import { useMemo, useState } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import CloseButton from "@/components/button/CloseButton";
import SelectMenu from "@/components/selectMenu";
import { FilterCard } from "./filter/FilterCard";
import { FilterSearchInput } from "./filter/FilterSearchInput";
import { FilterFieldHeader } from "./filter/FilterFieldHeader";
import { FilterDefinition, FilterPrimitive } from "../shared/filter-definition";
import { useFilterCondition } from "../shared/use-filter-condition";

type Props<TItem> = {
  filter: FilterDefinition<TItem>;
  icon?: ReactNode;
} & ComponentPropsWithRef<"section">;

/**
 * option フィールド向けのチェックリスト型フィルター（複数選択 / operator "in"）。
 */
export function MultiSelectFilter<TItem>({ filter, icon, ...props }: Props<TItem>) {
  const { condition, operator, setValue, setOperator, clear } =
    useFilterCondition(filter);
  const [query, setQuery] = useState("");
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

  const selectedValues = useMemo(() => {
    const value = condition?.value;
    if (Array.isArray(value)) {
      return value.map(String);
    }
    if (value === null || value === undefined) {
      return [];
    }
    return [String(value)];
  }, [condition?.value]);

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
      ),
    [options, query],
  );

  if (filter.inputType !== "option") {
    return null;
  }

  const toggleValue = (key: string) => {
    const nextKeys = selectedValues.includes(key)
      ? selectedValues.filter((current) => current !== key)
      : [...selectedValues, key];

    const nextValues = nextKeys.map((current) => valueByKey.get(current) ?? current);
    setValue(nextValues, "in");
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
      <FilterSearchInput
        aria-label={filter.label}
        placeholder="Buscar opciones"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery("")}
      />

      <SelectMenu
        isMulti
        isOpen
        hoveredIndex={hoveredIndex}
        selectedValues={selectedValues}
        onHoverItem={setHoveredIndex}
        onSelectItem={toggleValue}
        className="p-0 border-0 bg-transparent"
        options={filteredOptions}
      />
    </FilterCard>
  );
}
