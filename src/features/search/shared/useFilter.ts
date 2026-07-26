"use client";

import { useMemo } from "react";
import {
  FilterDefinition,
  FilterableItem,
} from "@/features/search/shared/filterDefinition";
import {
  applyFilterMatches,
  toFilterableItems,
} from "@/features/search/shared/filterEngine";
import { FilterDefinitionConfig } from "@/features/search/shared/filterField";
import { useFilterStoreProvider } from "@/features/search/components/Provider/useFilterStore";
import { buildFilterDefinitions } from "@/features/search/shared/filterFactory";

type UseFilterResult<TItem> = {
  definitions: FilterDefinition<TItem>[];
  filterableItems: FilterableItem<TItem>[];
};

export function useFilter<TItem extends { id: string }>(
  fields: FilterDefinitionConfig<TItem>[],
  items: TItem[],
): UseFilterResult<TItem> {
  const inicializedFilterableItems = useMemo(
    () => toFilterableItems(items),
    [items],
  );

  const conditions = useFilterStoreProvider((state) => state.conditions);

  // itemsの値自体はtoFilterableItemsで変更しない
  // const sourceItems = useMemo(
  //   () => inicializedFilterableItems.map((filterableItem) => filterableItem.item),
  //   [inicializedFilterableItems],
  // );
  const definitions = useMemo(
    () => buildFilterDefinitions(fields, items),
    [fields, items],
  );

  const filterableItems = useMemo(
    () => applyFilterMatches(inicializedFilterableItems, definitions, conditions),
    [inicializedFilterableItems, definitions, conditions],
  );

  return {
    definitions,
    filterableItems,
  };
}
