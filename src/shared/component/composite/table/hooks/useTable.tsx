"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type CellContext,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ColumnSizingState,
  type RowData,
  type SortingState,
  type Updater,
  type VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { DataViewConfig } from "@/shared/types/dataView.types";
import { buildDataViewMetadata } from "@/shared/component/composite/table/buildDataViewMetadata";
import {
  defineFilterCondition,
  type FilterCondition,
  type GetItemId,
  type SearchQuery,
} from "@/shared/service/dataPipeline/filterDefinition";
import {
  runFilter,
  selectMatchedRows,
} from "@/shared/service/dataPipeline/filterEngine";
import { compileDataViewSchema } from "@/shared/service/dataPipeline/filterFactory";

export type DataTableCellRenderer<TItem extends RowData> = (
  context: CellContext<TItem, unknown>,
) => ReactNode;

export type DataTableCellRenderers<
  TItem extends RowData,
  TFieldId extends string = string,
> = Readonly<Partial<Record<TFieldId, DataTableCellRenderer<TItem>>>>;

export type UseTableOptions<
  TItem extends RowData,
  TFieldId extends string = string,
> = {
  config: DataViewConfig<TItem, TFieldId>;
  data: readonly TItem[];
  getRowId: GetItemId<TItem>;
  query: SearchQuery;
  setSearchText: (text: string) => void;
  setConditions: (conditions: FilterCondition[]) => void;
  cellRenderers?: DataTableCellRenderers<TItem, TFieldId>;
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
    id: condition.fieldId,
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
      fieldId: columnFilter.id,
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

export function createTableColumnDefs<
  TItem extends RowData,
  TFieldId extends string = string,
>(
  config: DataViewConfig<TItem, TFieldId>,
  cellRenderers?: DataTableCellRenderers<TItem, TFieldId>,
): ColumnDef<TItem>[] {
  return config.fields.map((column) => {
    const minWidth = column.minWidth ?? DEFAULT_COLUMN_MIN_WIDTH;
    const maxWidth = column.maxWidth ?? DEFAULT_COLUMN_MAX_WIDTH;
    const estimatedWidth = clampWidth(
      estimateColumnWidth(column.label),
      minWidth,
      maxWidth,
    );
    const cellRenderer = cellRenderers?.[column.fieldId];

    return {
      id: column.fieldId,
      accessorFn: column.accessor,
      cell: (context) =>
        cellRenderer ? (
          cellRenderer(context)
        ) : (
          <span className="block w-full truncate">
            {column.format(context.row.original)}
          </span>
        ),
      header: column.label,
      minSize: minWidth,
      maxSize: maxWidth,
      size: estimatedWidth,
      sortDescFirst: false,
    };
  });
}

export function useTable<
  TItem extends RowData,
  TFieldId extends string = string,
>({
  config,
  data,
  getRowId,
  query,
  setSearchText,
  setConditions,
  cellRenderers,
}: UseTableOptions<TItem, TFieldId>) {
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
    () => createTableColumnDefs(config, cellRenderers),
    [cellRenderers, config],
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
