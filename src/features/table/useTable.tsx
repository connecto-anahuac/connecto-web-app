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

function contentMinSize(label: string) {
  return 98 + label.length * 12;
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
      config.columns.map((column) => ({
        id: column.id,
        accessorFn: column.accessor,
        cell: (context) => column.format(context.row.original),
        filterFn: dataViewFilter,
        header: column.label,
        minSize: contentMinSize(column.label),
        size: Math.max(column.initialSize ?? 0, contentMinSize(column.label)),
        sortDescFirst: false,
      })),
    [config.columns, dataViewFilter],
  );

  const tableData = useMemo(() => [...data], [data]);
//   const filterFns = useMemo(
//     () => ({ dataView: dataViewFilter }),
//     [dataViewFilter],
//   );

  // TanStack intentionally returns a mutable table instance for event handlers.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: tableData,
    // filterFns,
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
