"use client";

import { useMemo, useState, type ComponentPropsWithRef } from "react";
import CloseButton from "@/shared/component/primitive/button/CloseButton";
import type {
  DataFieldConfig,
  DataFieldOption,
} from "@/shared/types/dataView.types";
import { runFilterDataFieldOptions } from "@/shared/component/composite/table/buildDataViewMetadata";
import type { Operator } from "../../../../service/dataPipeline/operatorPolicy";
import { FilterCard } from "../FilterCard";
import { FilterFieldHeader } from "../FilterFieldHeader";
import { FilterSearchInput } from "../filterinput/FilterSearchInput";
import SelectMenuNew from "@/shared/component/primitive/selectMenuNew";
import MultiSelect from "@/shared/component/primitive/MultiSelect";

type Props<TItem> = ComponentPropsWithRef<"section"> & {
  column: DataFieldConfig<TItem>;
  operator: Operator;
  options: readonly DataFieldOption[];
  values: readonly string[];
  onClose: () => void;
  onOperatorChange: (operator: Operator) => void;
  onValueChange: (value: string[]) => void;
};

export function MultiSelectFilter<TItem>({
  column,
  operator,
  options,
  values: value,
  onClose,
  onOperatorChange,
  onValueChange,
  ...props
}: Props<TItem>) {
  const [query, setQuery] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const filteredOptions = useMemo(() => {
    return runFilterDataFieldOptions(options, query).map((option) => ({
      label: option.label,
      value: option.value,
    }));
  }, [options, query]);
  const selectedOptions = useMemo(() => {
    const labelsByValue = new Map(
      options.map((option) => [option.value, option.label]),
    );

    return value.map((selectedValue) => ({
      label: labelsByValue.get(selectedValue) ?? selectedValue,
      value: selectedValue,
    }));
  }, [options, value]);

  const toggleValue = (nextValue: string) => {
    onValueChange(
      value.includes(nextValue)
        ? value.filter((current) => current !== nextValue)
        : [...value, nextValue],
    );
    setQuery("");
  };

  const removeValue = (removedValue: string) => {
    onValueChange(
      value.filter((currentValue) => currentValue !== removedValue),
    );
  };

  return (
    <FilterCard
      {...props}
      className="max-w-72"
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
      <FilterSearchInput
        aria-label={column.label}
        chips={selectedOptions}
        placeholder="Buscar opciones"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onChipRemove={removeValue}
        onClear={() => { setQuery(""); onValueChange([]);}}
        isFocusedInitially
      />

      <div className="w-full max-h-96 h-fit overflow-y-auto">
        <SelectMenuNew.Root
          isOpen
          hoveredIndex={hoveredIndex}
          selectedValues={value}
          onHoverItem={setHoveredIndex}
          onSelectItem={toggleValue}
          className="p-0 border-0 bg-transparent"
        >
          {filteredOptions.map((option) => (
            <SelectMenuNew.Option key={option.value} value={option.value}>
              <MultiSelect label={option.label} />
            </SelectMenuNew.Option>
          ))}
        </SelectMenuNew.Root>
      </div>
    </FilterCard>
  );
}
