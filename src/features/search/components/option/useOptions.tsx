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
import { useOptionStore } from "./optionStore";
import { DATA_CACHE_ID } from "@/shared/types/consts";

type UseOptions<TItem extends RowData> = {
  config: DataViewConfig<TItem>;
  data: readonly TItem[];
  cacheId: DATA_CACHE_ID;
};

function createOptionMaps<TItem extends RowData>(
  config: DataViewConfig<TItem>,
  data: readonly TItem[],
) {
  return new Map(
    config.columns.map((column) => {
      const staticOptions: Option[] = (column.options ?? []).map((option) => ({
        ...option,
        searchTexts: [option.label, option.value],
      }));

      const valueMap = new Map<string, TItem>();
      for (const row of data) {
        const value = column.accessor(row);
        if (value != null) {
          valueMap.set(String(value), row);
        }
      }

      const dynamicOptions: Option[] = column.dynamicOption
        ? [
            ...new Set(
              data
                .map(column.accessor)
                .filter((value): value is string | number => value !== null)
                .map(String),
            ),
          ].map((value) => {
            const item = valueMap.get(value)!;

            return {
              label: column.format(item),
              value: String(value),
              searchTexts: [
                // value,
                // column.format(item),
                ...(column.searchTexts?.(item) ?? []),
              ],
            };
          })
        : [];

      return [column.id, [...staticOptions, ...dynamicOptions]] as const;
    }),
  );
}

export function useOptions<TItem extends RowData>({
  config,
  data,
  cacheId,
}: UseOptions<TItem>) {
  const optionMapByColumnId = useMemo(
    () => createOptionMaps(config, data),
    [config, data],
  );

  useOptionStore((state) => state.setOptions(cacheId, optionMapByColumnId));

  //TODO storeじゃない方が良い？
  const optionMap = useOptionStore((state) => state.optionsById.get(cacheId));

  return { optionMap: optionMap };
}
