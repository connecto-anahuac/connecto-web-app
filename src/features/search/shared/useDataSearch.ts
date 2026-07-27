"use client";

import { useCallback, useMemo } from "react";
import { useDataSearchStore } from "@/features/search/components/Provider/useFilterStore";
import type { DataPropertyConfig } from "./filterField";
import { compilePropertySchema } from "./filterFactory";
import { runSearch, selectGridEntries, selectListEntries } from "./filterEngine";
import type { FilterCondition, FilterConditionValue } from "./filterDefinition";
import type { Operator } from "./operatorPolicy";

export function useDataSearch<TItem>(
  properties: readonly DataPropertyConfig<TItem>[],
  items: readonly TItem[],
) {
  const query = useDataSearchStore((state) => state.query);
  const setSearchText = useDataSearchStore((state) => state.setSearchText);
  const upsertCondition = useDataSearchStore((state) => state.upsertCondition);
  const removeCondition = useDataSearchStore((state) => state.removeCondition);

  const schema = useMemo(
    () => compilePropertySchema(properties, items),
    [items, properties],
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
        id: fieldKey,
        fieldKey,
        operator: operator ?? query.conditions.find((condition) => condition.fieldKey === fieldKey)?.operator ?? property.operators[0]!,
        value: canonicalValue,
      });
    },
    [query.conditions, removeCondition, schema.byKey, upsertCondition],
  );

  const setPresetCondition = useCallback(
    (condition: FilterCondition | null) => {
      if (!condition) return;
      setCondition(condition.fieldKey, condition.value, condition.operator);
    },
    [setCondition],
  );

  return {
    definitions: schema.properties,
    query,
    result,
    listEntries: selectListEntries(result),
    gridEntries: selectGridEntries(result),
    searchText: query.text,
    setSearchText,
    setCondition,
    setPresetCondition,
    removeCondition,
  };
}
