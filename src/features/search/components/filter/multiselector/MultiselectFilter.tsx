"use client";

import { useMemo, useState, type ComponentPropsWithRef } from "react";
import CloseButton from "@/components/button/CloseButton";
import SelectMenu from "@/components/selectMenu";
import type {
  DataViewColumn,
  Option,
} from "@/components/table/dataView.types";
import { runFilterDataViewOptions } from "@/components/table/buildDataViewMetadata";
import type { Operator } from "../../../shared/operatorPolicy";
import { FilterCard } from "../FilterCard";
import { FilterFieldHeader } from "../FilterFieldHeader";
import { FilterSearchInput } from "../FilterSearchInput";

type Props<TItem> = ComponentPropsWithRef<"section"> & {
  column: DataViewColumn<TItem>;
  operator: Operator;
  options: readonly Option[];
  value: readonly string[];
  onClear: () => void;
  onOperatorChange: (operator: Operator) => void;
  onValueChange: (value: string[]) => void;
};

export function MultiSelectFilter<TItem>({
  column,
  operator,
  options,
  value,
  onClear,
  onOperatorChange,
  onValueChange,
  ...props
}: Props<TItem>) {
  const [query, setQuery] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const filteredOptions = useMemo(() => {
    return runFilterDataViewOptions(options, query)
      .map((option) => ({
        label: option.label,
        value: option.value,
      }));
  }, [options, query]);

  const toggleValue = (nextValue: string) => {
    onValueChange(
      value.includes(nextValue)
        ? value.filter((current) => current !== nextValue)
        : [...value, nextValue],
    );
  };

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
          selectedValues={[...value]}
          onHoverItem={setHoveredIndex}
          onSelectItem={toggleValue}
          className="p-0 border-0 bg-transparent"
          options={filteredOptions}
        />
      </div>
    </FilterCard>
  );
}
