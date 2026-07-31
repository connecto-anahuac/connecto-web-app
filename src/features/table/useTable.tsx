"use client";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ColumnSizingState,
  type FilterFn,
  type RowData,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  DataViewConfig,
  // DataViewValueType,
} from "@/components/table/dataView.types";
// import { getOperatorsForDataViewValueType } from "./operatorPolicy";
import { defineFilterCondition, type FilterCondition } from "./type";

//TODO deprecated? custom engine Value
import {
  defineFilterPrimitive,
  FilterConditionValue,
  FilterPrimitive,
  ValueType,
} from "../search/shared/filterDefinition";
import { getOperatorsForValueType } from "../search/shared/operatorPolicy";

type UseTableOptions<TItem extends RowData> = {
  config: DataViewConfig<TItem>;
  data: readonly TItem[];
};

const DEFAULT_COLUMN_MIN_WIDTH = 140;
const DEFAULT_COLUMN_MAX_WIDTH = 1200;
const HEADER_LABEL_CHAR_WIDTH = 9;
const HEADER_ICON_WIDTH = 18;
const HEADER_ICON_GAP = 3;
const HEADER_ACTION_BUTTON_WIDTH = 32;
const HEADER_ACTIONS_GAP = 4;
const HEADER_HORIZONTAL_PADDING = 20;
const HEADER_ESTIMATE_BUFFER = 20;

function include(rawValue: unknown, filterValue: unknown) {
  if (
    filterValue === undefined ||
    filterValue === "" ||
    (Array.isArray(filterValue) && !filterValue.length)
  ) {
    return true;
  }

  if (Array.isArray(filterValue)) {
    return filterValue.includes(String(rawValue));
  }

  if (typeof rawValue === "number" && typeof filterValue === "number") {
    return rawValue === filterValue;
  }

  return String(rawValue ?? "")
    .toLocaleLowerCase()
    .includes(String(filterValue).toLocaleLowerCase());
}

function isRangeValue(
  value: FilterConditionValue,
): value is [FilterPrimitive, FilterPrimitive] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(
      (entry) => !Array.isArray(entry) && defineFilterPrimitive(entry),
    )
  );
}

function compare(left: FilterPrimitive, right: FilterPrimitive): number {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  if (typeof left === "boolean" && typeof right === "boolean") {
    return Number(left) - Number(right);
  }

  return String(left).localeCompare(String(right));
}

type MatchesConditionOptions = {
  actual: unknown;
  filterValue: FilterCondition;
  searchValues: readonly unknown[];
  valueType: ValueType;
};

export function matchesCondition({
  actual,
  filterValue,
  searchValues,
  valueType,
}: MatchesConditionOptions): boolean {
  if (!getOperatorsForValueType(valueType).includes(filterValue.operator)) {
    return false;
  }

  const actualValues = Array.isArray(actual)
    ? actual
    : actual === null
      ? []
      : [actual];
  if (!actualValues.every(defineFilterPrimitive)) {
    return false;
  }

  const expected = filterValue.value;
  if (expected === null) {
    return false;
  }

  switch (filterValue.operator) {
    case "eq":
      return (
        !Array.isArray(expected) &&
        actualValues.some(
          (value) =>
            String(value ?? "").toLocaleLowerCase() ===
            String(expected).toLocaleLowerCase(),
        )
      );
    case "in":
      return (
        Array.isArray(expected) &&
        searchValues.some((value) =>
          expected.some(
            (filterValueItem) =>
              String(value ?? "").toLocaleLowerCase() ===
              String(filterValueItem).toLocaleLowerCase(),
          ),
        )
      );
    case "contains":
      return (
        !Array.isArray(expected) &&
        searchValues.some((value) =>
          String(value ?? "")
            .toLocaleLowerCase()
            .includes(String(expected).toLocaleLowerCase()),
        )
      );
    case "between": {
      if (!isRangeValue(expected) || actualValues.length !== 1) {
        return false;
      }

      const actualValue = actualValues[0]!;
      return (
        compare(actualValue, expected[0]) >= 0 &&
        compare(actualValue, expected[1]) <= 0
      );
    }
    case "gt":
    case "gte":
    case "lt":
    case "lte": {
      if (Array.isArray(expected) || actualValues.length !== 1) {
        return false;
      }

      const result = compare(actualValues[0]!, expected);
      return filterValue.operator === "gt"
        ? result > 0
        : filterValue.operator === "gte"
          ? result >= 0
          : filterValue.operator === "lt"
            ? result < 0
            : result <= 0;
    }
  }
}

function clampWidth(width: number, minWidth: number, maxWidth: number) {
  return Math.min(Math.max(width, minWidth), maxWidth);
}

function estimateColumnWidth(label: string) {
  const compactHeaderWidth =
    HEADER_ICON_WIDTH +
    HEADER_ICON_GAP +
    HEADER_ACTION_BUTTON_WIDTH * 2 +
    HEADER_ACTIONS_GAP +
    HEADER_HORIZONTAL_PADDING;

  return (
    label.length * HEADER_LABEL_CHAR_WIDTH +
    compactHeaderWidth +
    HEADER_ESTIMATE_BUFFER
  );
}

export function useTable<TItem extends RowData>({
  config,
  data,
}: UseTableOptions<TItem>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  const columnConfigMapById = useMemo(
    () => new Map(config.columns.map((column) => [column.id, column])),
    [config.columns],
  );

  const dataViewFilter = useCallback<FilterFn<TItem>>(
    (row, columnId, filterValue) => {
      const rawValue = row.getValue(columnId);
      const columnConfig = columnConfigMapById.get(columnId);
      const optionLabel = columnConfig?.options?.find(
        (option) => option.value === String(rawValue),
      )?.label;
      const searchValues = [
        rawValue,
        optionLabel,
        ...(columnConfig?.searchTexts?.(row.original) ?? []),
      ];

      if (defineFilterCondition(filterValue)) {
        return (
          filterValue.columnId === columnId &&
          columnConfig !== undefined &&
          matchesCondition({
            actual: rawValue,
            filterValue,
            searchValues,
            valueType: columnConfig.valueType,
          })
        );
      }

      return searchValues.some((value) => include(value, filterValue));
    },
    [columnConfigMapById],
  );

  const columnDefs = useMemo<ColumnDef<TItem>[]>(
    () =>
      config.columns.map((column) => {
        const minWidth = column.minWidth ?? DEFAULT_COLUMN_MIN_WIDTH;
        const maxWidth = column.maxWidth ?? DEFAULT_COLUMN_MAX_WIDTH;
        const estimatedWidth = clampWidth(
          estimateColumnWidth(column.label),
          minWidth,
          maxWidth,
        );

        return {
          id: column.id,
          accessorFn: column.accessor,
          cell: (context) => column.format(context.row.original),
          filterFn: dataViewFilter,
          header: column.label,
          minSize: minWidth,
          maxSize: maxWidth,
          size: estimatedWidth,
          sortDescFirst: false,
        };
      }),
    [config.columns, dataViewFilter],
  );

  const tableData = useMemo(() => [...data], [data]);

  // TanStack intentionally returns a mutable table instance for event handlers.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: columnDefs,
    data: tableData,
    
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: dataViewFilter,
    columnResizeMode: "onChange",
    onColumnFiltersChange: setColumnFilters,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnPinning,
      columnSizing,
      columnVisibility,
      globalFilter,
      sorting,
    },
  });

  // resizing handler

  const isResizing =
    table.getState().columnSizingInfo.isResizingColumn !== false;
  useEffect(() => {
    if (isResizing) {
      document.body.classList.add("cursor-col-resize-important");
    } else {
      document.body.classList.remove("cursor-col-resize-important");
    }

    return () => document.body.classList.remove("cursor-col-resize-important");
  }, [isResizing]);

  return {
    globalFilter,
    setGlobalFilter,
    table,
  };
}
