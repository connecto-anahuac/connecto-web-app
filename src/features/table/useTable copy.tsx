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
import { useCallback, useMemo, useState } from "react";
import type { DataViewConfig, Option } from "@/components/table/dataView.types";

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
  // rawValue in filterValue

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
  //console.log(`estimateColumnWidth: label=${label}, width=${label.length * HEADER_LABEL_CHAR_WIDTH + compactHeaderWidth + HEADER_ESTIMATE_BUFFER}`);

  return (
    label.length * HEADER_LABEL_CHAR_WIDTH +
    compactHeaderWidth +
    HEADER_ESTIMATE_BUFFER
  );
}

function addOption(options: Map<string, Option>, option: Option) {
  const current = options.get(option.value);
  if (current) {
    options.set(option.value, {
      ...current,
      searchTexts: [...new Set([...current.searchTexts, ...option.searchTexts])],
    });
    return;
  }

  options.set(option.value, option);
}

function createOptionMaps<TItem extends RowData>(
  config: DataViewConfig<TItem>,
  data: readonly TItem[],
) {
  return new Map(
    config.columns.map((column) => {
      const options = new Map<string, Option>();

      for (const option of column.options ?? []) {
        addOption(options, {
          ...option,
          searchTexts: [option.label, option.value],
        });
      }

      if (column.dynamicOption) {
        for (const item of data) {
          const rawValue = column.accessor(item);
          if (rawValue === null) continue;

          const value = String(rawValue);
          addOption(options, {
            label: column.format(item),
            value,
            searchTexts: [
              value,
              column.format(item),
              ...(column.searchTexts?.(item) ?? []),
            ],
          });
        }
      }

      return [column.id, options] as const;
    }),
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

  const optionMapsByColumnId = useMemo(
    () => createOptionMaps(config, data),
    [config, data],
  );

  const tableConfig = useMemo<DataViewConfig<TItem>>(
    () => ({
      ...config,
      columns: config.columns.map((column) => {
        const options = optionMapsByColumnId.get(column.id);
        return options?.size
          ? { ...column, options: [...options.values()] }
          : column;
      }),
    }),
    [config, optionMapsByColumnId],
  );

  const dataViewFilter = useCallback<FilterFn<TItem>>(
    (row, columnId, filterValue) => {
      // filterValue would be 
      // rawvalue, option.label, static searchTexts

      const rawValue = row.getValue(columnId);
      const option = optionMapsByColumnId
        .get(columnId)
        ?.get(String(rawValue));
      const searchValues = [
        rawValue,
        option?.label,
        ...(option?.searchTexts ?? []),
      ];

      return searchValues.some((value) => include(value, filterValue));
    },
    [optionMapsByColumnId],
  );

  const columnDefs = useMemo<ColumnDef<TItem>[]>(
    () =>
      tableConfig.columns.map((column) => {
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
    [dataViewFilter, tableConfig.columns],
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

  return {
    config: tableConfig,
    globalFilter,
    optionMapsByColumnId,
    setGlobalFilter,
    table,
  };
}
