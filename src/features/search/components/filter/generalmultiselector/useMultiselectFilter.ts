"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  FilterDefinition,
  FilterPrimitive,
} from "../../../shared/filterDefinition";
import { useFilterCondition } from "../../../shared/useFilterCondition";

export const useMultiselectFilter =<TItem>(filter: FilterDefinition<TItem>)=>{
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

  const toggleValue = useCallback(
    (key: string) => {
      const nextKeys = selectedValues.includes(key)
        ? selectedValues.filter((current) => current !== key)
        : [...selectedValues, key];
      const nextValues = nextKeys.map(
        (current) => valueByKey.get(current) ?? current,
      );

      setValue(nextValues, "in");
    },
    [selectedValues, setValue, valueByKey],
  );

  return {
    clear,
    filteredOptions,
    hoveredIndex,
    operator,
    query,
    selectedValues,
    setHoveredIndex,
    setOperator,
    setQuery,
    toggleValue,
  };
}
