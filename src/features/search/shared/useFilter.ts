"use client";

import { useMemo } from "react";
import type { FilterDefinition, FilterableItem } from "./filterDefinition";
import { runSearch } from "./filterEngine";
import type { DataPropertyConfig } from "./filterField";
import { compilePropertySchema } from "./filterFactory";
import { useFilterStoreProvider } from "../components/Provider/useFilterStore";

type UseFilterResult<TItem> = {
  definitions: readonly FilterDefinition<TItem>[];
  filterableItems: readonly FilterableItem<TItem>[];
};

/** @deprecated Prefer useDataSearch. */
export function useFilter<TItem>(
  fields: readonly DataPropertyConfig<TItem>[],
  items: readonly TItem[],
  searchText: string,
): UseFilterResult<TItem> {
  const conditions = useFilterStoreProvider((state) => state.conditions);
  const schema = useMemo(() => compilePropertySchema(fields, items), [fields, items]);
  const filterableItems = useMemo(
    () => runSearch(items, { text: searchText, conditions }, schema).entries,
    [conditions, items, schema, searchText],
  );

  return { definitions: schema.properties, filterableItems };
}
