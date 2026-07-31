"use client";

import type { ComponentPropsWithRef } from "react";
import type { IconName } from "@/components/icon";
import CloseButton from "@/components/button/CloseButton";
import SelectMenu from "@/components/selectMenu";
import { FilterCard } from "../FilterCard";
import { FilterFieldHeader } from "../FilterFieldHeader";
import { FilterSearchInput } from "../FilterSearchInput";
import type { FilterDefinition } from "../../../shared/filterDefinition";
import type { Operator } from "../../../shared/operatorPolicy";

type MultiselectFilterPresenterProps<TItem> = {
  clear: () => void;
  filter: FilterDefinition<TItem>;
  filteredOptions: { label: string; value: string }[];
  hoveredIndex: number;
  icon?: IconName;
  operator: Operator;
  query: string;
  selectedValues: string[];
  setHoveredIndex: (index: number) => void;
  setOperator: (operator: Operator) => void;
  setQuery: (query: string) => void;
  toggleValue: (key: string) => void;
} & ComponentPropsWithRef<"section">;

export function MultiselectFilterPresenter<TItem>({
  clear,
  filter,
  filteredOptions,
  hoveredIndex,
  icon,
  operator,
  query,
  selectedValues,
  setHoveredIndex,
  setOperator,
  setQuery,
  toggleValue,
  ...props
}: MultiselectFilterPresenterProps<TItem>) {
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
        isFocusedInitially
      />

      <div className="w-full max-h-96 h-fit overflow-y-auto">
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
      </div>
    </FilterCard>
  );
}
