"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FilterDefinition,
  FilterableItem,
} from "@/features/search/shared/filter-definition";
import { applyFilterMatches, toFilterableItems } from "@/features/search/shared/filter-engine";
import { FilterField } from "@/features/search/shared/filter-field";
import { useFilterStore } from "@/features/search/components/useFilterStore";
import { buildFilterDefinitions } from "@/features/search/shared/filter-factory";

type UseFilterResult<TItem> = {
  loading: boolean;
  definitions: FilterDefinition<TItem>[];
  filterableItems: FilterableItem<TItem>[];
};

export function useFilter<TItem extends { id: string }, TRawItem>(
  fields: FilterField<TItem>[],
  fetchTargetFilterableList: () => Promise<TRawItem[]>,
  mapperRepoToUI: (item: TRawItem) => TItem,
): UseFilterResult<TItem> {
  const [loading, setLoading] = useState(true);
  const [baseFilterableItems, setBaseFilterableItems] = useState<FilterableItem<TItem>[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadTargetFilterableList() {
      setLoading(true);

      try {
        const res = await fetchTargetFilterableList();
        if (!mounted)  return;

        const nextTarget = res.map(mapperRepoToUI);
        setBaseFilterableItems(toFilterableItems(nextTarget));
      } catch (error) {
        console.error("Failed loading target lists", error);
      } finally {
        if (mounted)  setLoading(false);
      }
    }

    void loadTargetFilterableList();

    return () => {
      mounted = false;
    };
  }, [fetchTargetFilterableList, mapperRepoToUI]);

  const conditions = useFilterStore((state) => state.conditions);
   const items = useMemo(
    () => baseFilterableItems.map((filterableItem) => filterableItem.item),
    [baseFilterableItems],
  );
  const definitions = useMemo(
    () => buildFilterDefinitions(fields, items),
    [fields, items],
  );

  const filterableItems = useMemo(
    () => applyFilterMatches(baseFilterableItems, definitions, conditions),
    [baseFilterableItems, definitions, conditions],
  );

  return {
    loading,
    definitions,
    filterableItems,
  };
}

