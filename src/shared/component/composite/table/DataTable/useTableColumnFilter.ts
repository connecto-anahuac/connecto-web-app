"use client";

import type { Column } from "@tanstack/react-table";
import type { DataFieldConfig } from "../../../../types/dataView.types";
import { FilterCondition } from "@/shared/service/dataPipeline/filterDefinition";
// import type { FilterCondition } from "@/features/table/type";

function getDefaultOperator(
  valueType: DataFieldConfig<never>["valueType"],
): FilterCondition["operator"] {
  if (valueType === "enum") return "in";
  if (valueType === "number" || valueType === "date") return "eq";
  return valueType === "text" ? "contains" : "eq";
}

export function useTableColumnFilter<TItem>(
  column: Column<TItem>,
  config: DataFieldConfig<TItem>,
  onClose?: () => void,
) {
  const currentValue = column.getFilterValue() as FilterCondition | undefined;

  const handleClear = () => {
    column.setFilterValue(undefined);
    onClose?.();
  };

  const handleEnumValueToggle = (value: string) => {
    const values = Array.isArray(currentValue?.value) ? currentValue.value : [];
    const next = values.includes(value)
      ? values.filter((current) => current !== value)
      : [...values, value];
    column.setFilterValue(
      next.length
        ? { columnId: config.fieldId, operator: "in", value: next }
        : undefined,
    );
  };

  const handleInputChange = (value: string) => {
    column.setFilterValue(
      value
        ? {
            fieldId: config.fieldId,
            operator: getDefaultOperator(config.valueType),
            value: config.valueType === "number" ? Number(value) : value,
          }satisfies FilterCondition
        : undefined,
    );
  };

  return {
    currentValue,
    onClear: handleClear,
    onEnumValueToggle: handleEnumValueToggle,
    onInputChange: handleInputChange,
  };
}
