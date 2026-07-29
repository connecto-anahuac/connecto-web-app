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
import type { DataViewConfig } from "@/components/table/dataView.types";

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

function tableFilter(rawValue: unknown, filterValue: unknown) {
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

  return label.length * HEADER_LABEL_CHAR_WIDTH +
    compactHeaderWidth +
    HEADER_ESTIMATE_BUFFER;
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

  const columnsById = useMemo(
    () => new Map(config.columns.map((column) => [column.id, column])),
    [config.columns],
  );

  const dataViewFilter = useCallback<FilterFn<TItem>>(
    (row, columnId, filterValue) => {
      const rawValue = row.getValue(columnId);
      const column = columnsById.get(columnId);
      const optionLabel = column?.options?.find(
        (option) => option.value === String(rawValue),
      )?.label;
      const searchValues = [
        rawValue,
        optionLabel,
        ...(column?.searchTexts?.(row.original) ?? []),
      ];

      return searchValues.some((value) => tableFilter(value, filterValue));
    },
    [columnsById],
  );

  const columns = useMemo<ColumnDef<TItem>[]>(
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
    columns,
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
    globalFilter,
    setGlobalFilter,
    table,
  };
}
