"use client";

import { useCallback, useMemo } from "react";
import {
  useDataSearchActions,
  useDataSearchQuery,
} from "@/shared/store/filter/useFilterStore";
import type { DataViewConfig } from "@/shared/types/dataView.types";
import { buildDataViewMetadata } from "@/shared/component/composite/table/buildDataViewMetadata";
import { compileDataViewSchema } from "../../../service/dataPipeline/filterFactory";
import { runSearch, selectGridEntries, selectListEntries } from "../../../service/dataPipeline/filterEngine";
import type { FilterCondition, FilterConditionValue } from "../../../service/dataPipeline/filterDefinition";
import type { Operator } from "../../../service/dataPipeline/operatorPolicy";

// @deprecated: useDataSearch is a temporary hook to provide search functionality for the table component. It will be replaced by a more robust solution in the future.
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
        fieldId: fieldKey,
        operator: operator ?? query.conditions.find((condition) => condition.fieldId === fieldKey)?.operator ?? property.operators[0]!,
        value: canonicalValue,
      });
    },
    [query.conditions, removeCondition, schema.byKey, upsertCondition],
  );

  //TODO presetは自動でfilter読み取ってない？
  const setPresetCondition = useCallback(
    (condition: FilterCondition | null) => {
      if (!condition) return;
      setCondition(condition.fieldId, condition.value, condition.operator);
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
