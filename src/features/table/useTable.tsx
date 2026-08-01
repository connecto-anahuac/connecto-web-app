"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ColumnSizingState,
  type RowData,
  type SortingState,
  type Updater,
  type VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import type { DataViewConfig } from "@/components/table/dataView.types";
import { buildDataViewMetadata } from "@/components/table/buildDataViewMetadata";
import {
  defineFilterCondition,
  type FilterCondition,
  type GetRowId,
  type SearchQuery,
} from "@/features/search/shared/filterDefinition";
import {
  runFilter,
  selectMatchedRows,
} from "@/features/search/shared/filterEngine";
import { compileDataViewSchema } from "@/features/search/shared/filterFactory";

type UseTableOptions<TItem extends RowData> = {
  config: DataViewConfig<TItem>;
  data: readonly TItem[];
  getRowId: GetRowId<TItem>;
  query: SearchQuery;
  setSearchText: (text: string) => void;
  setConditions: (conditions: FilterCondition[]) => void;
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

export function toTanstacColumnFiltersState(//TODO header-> menu complete->remove
  conditions: readonly FilterCondition[],
): ColumnFiltersState {
  return conditions.map((condition) => ({
    id: condition.columnId,
    value: condition,
  }));
}

export function toFilterConditions(
  columnFilters: ColumnFiltersState,
): FilterCondition[] {
  const conditions: FilterCondition[] = [];

  for (const columnFilter of columnFilters) {
    if (!defineFilterCondition(columnFilter.value)) continue;
    conditions.push({
      columnId: columnFilter.id,
      operator: columnFilter.value.operator,
      value: columnFilter.value.value,
    });
  }

  return conditions;
}

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === "function"
    ? (updater as (value: T) => T)(previous)
    : updater;
}

export function resolveFilterConditionsUpdate(//TODO header-> menu complete->remove
  updater: Updater<ColumnFiltersState>,
  currentConditions: readonly FilterCondition[],
): FilterCondition[] {
  return toFilterConditions(
    resolveUpdater(updater, toTanstacColumnFiltersState(currentConditions)),
  );
}

export function useTable<TItem extends RowData>({
  config,
  data,
  getRowId,
  query,
  setSearchText,
  setConditions,
}: UseTableOptions<TItem>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  const metadata = useMemo(
    () => buildDataViewMetadata(config, data),
    [config, data],
  );
  const schema = useMemo(
    () => compileDataViewSchema(config, data, metadata),
    [config, data, metadata],
  );
  const columnFilters = useMemo(//TODO header-> menu complete->remove
    () => toTanstacColumnFiltersState(query.conditions),
    [query.conditions],
  );
  const filterResult = useMemo(
    () => runFilter(data, query, schema, getRowId),
    [data, getRowId, query, schema],
  );
  const filteredRows = useMemo(
    () => selectMatchedRows(data, filterResult, getRowId),
    [data, filterResult, getRowId],
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
          header: column.label,
          minSize: minWidth,
          maxSize: maxWidth,
          size: estimatedWidth,
          sortDescFirst: false,
        };
      }),
    [config.columns],
  );

  // TanStack intentionally returns a mutable table instance for event handlers.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: columnDefs,
    data: filteredRows,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    columnResizeMode: "onChange",
    onColumnFiltersChange: (updater) =>//TODO header-> menu complete->remove
      setConditions(
        resolveFilterConditionsUpdate(updater, query.conditions),
      ),
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: (updater) =>
      setSearchText(resolveUpdater(updater, query.globalTextQuery)),
    onSortingChange: setSorting,
    state: {
      columnFilters,//TODO header-> menu complete->remove
      columnPinning,
      columnSizing,
      columnVisibility,
      globalFilter: query.globalTextQuery,
      sorting,
    },
  });

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
    globalFilter: query.globalTextQuery,
    setGlobalFilter: setSearchText,
    table,
    filterResult,
    metadata,
  };
}
