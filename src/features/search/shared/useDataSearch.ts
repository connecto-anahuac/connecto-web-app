"use client";

import { useCallback, useMemo } from "react";
import {
  useDataSearchActions,
  useDataSearchQuery,
} from "@/features/search/components/Provider/useFilterStore";
import type { DataViewConfig } from "@/components/table/dataView.types";
import { buildDataViewMetadata } from "@/components/table/buildDataViewMetadata";
import { compileDataViewSchema } from "./filterFactory";
import { runSearch, selectGridEntries, selectListEntries } from "./filterEngine";
import type { FilterCondition, FilterConditionValue } from "./filterDefinition";
import type { Operator } from "./operatorPolicy";

export function useDataSearch<TItem>(
  config: DataViewConfig<TItem>,
  items: readonly TItem[],
) {
  const query = useDataSearchQuery();
  const { removeCondition, setSearchText, upsertCondition } =
    useDataSearchActions();

  const metadata = useMemo(
    () => buildDataViewMetadata(config, items),
    [config, items],
  );
  const schema = useMemo(
    () => compileDataViewSchema(config, items, metadata),
    [config, items, metadata],
  );
  const result = useMemo(() => runSearch(items, query, schema), [items, query, schema]);

  const setCondition = useCallback(
    (fieldKey: string, value: FilterConditionValue, operator?: Operator) => {
      const property = schema.byKey.get(fieldKey);
      if (!property) return;
      const canonicalValue = property.normalizeConditionValue(value);
      if (canonicalValue === null) {
        removeCondition(fieldKey);
        return;
      }
      upsertCondition({
        // id: fieldKey,
        columnId: fieldKey,
        operator: operator ?? query.conditions.find((condition) => condition.columnId === fieldKey)?.operator ?? property.operators[0]!,
        value: canonicalValue,
      });
    },
    [query.conditions, removeCondition, schema.byKey, upsertCondition],
  );

  //TODO presetは自動でfilter読み取ってない？
  const setPresetCondition = useCallback(
    (condition: FilterCondition | null) => {
      if (!condition) return;
      setCondition(condition.columnId, condition.value, condition.operator);
    },
    [setCondition],
  );

  return {
    config,
    metadata,
    query,
    result,
    listEntries: selectListEntries(result),
    gridEntries: selectGridEntries(result),
    searchText: query.globalTextQuery,
    setSearchText,
    setCondition,
    setPresetCondition,
    removeCondition,
  };
}
