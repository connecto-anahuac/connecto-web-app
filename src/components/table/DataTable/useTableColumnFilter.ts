"use client";

import type { Column, Header, Table } from "@tanstack/react-table";
import type { DataViewColumn, DataViewConfig } from "../dataView.types";
import type { FilterValue } from "./DataTable.types";

export function useTableColumnFilter<TItem>(
  column: Column<TItem>,
  config: DataViewColumn<TItem>,
  onClose?: () => void,
) {
  const currentValue = column.getFilterValue() as FilterValue;

  const handleClear = () => {
    column.setFilterValue(undefined);
    onClose?.();
  };

  const handleEnumValueToggle = (value: string) => {
    const values = Array.isArray(currentValue) ? currentValue : [];
    const next = values.includes(value)
      ? values.filter((current) => current !== value)
      : [...values, value];
    column.setFilterValue(next.length ? next : undefined);
  };

  const handleInputChange = (value: string) => {
    column.setFilterValue(
      config.valueType === "number" && value !== ""
        ? Number(value)
        : value || undefined,
    );
  };

  return {
    currentValue,
    onClear: handleClear,
    onEnumValueToggle: handleEnumValueToggle,
    onInputChange: handleInputChange,
  };
}
