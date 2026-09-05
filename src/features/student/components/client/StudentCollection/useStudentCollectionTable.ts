"use client";

import {
  useDataSearchActions,
  useDataSearchQuery,
} from "@/shared/store/filter/useFilterStore";
import type {
  FilterCondition,
  GetItemId,
} from "@/shared/service/dataPipeline/filterDefinition";
import type { FilterPreset } from "@/shared/service/dataPipeline/filterPreset.type";
import { useTable } from "@/shared/component/composite/table/hooks/useTable";
import { StudentCollectionItem } from "./studentCollection.type";
import { STUDENT_COLLECTION_PRESETS, STUDENT_COLLECTION_VIEW_CONFIG } from "./studentClassViewConfig";

const getStudentCollectionRowId: GetItemId<StudentCollectionItem> = (row) => row.studentId;

export function useStudentCollectionTable(data: readonly StudentCollectionItem[] ) {
  // const data: readonly StudentCollectionItem[] = []; // Placeholder for actual data, replace with real data source

  const query = useDataSearchQuery();
  const {
    removeCondition,
    setConditions,
    setSearchText,
    upsertCondition,
  } = useDataSearchActions();
  const { globalFilter, setGlobalFilter, table, filterResult, metadata } = useTable({
    config: STUDENT_COLLECTION_VIEW_CONFIG,
    data,
    getRowId: getStudentCollectionRowId,
    query,
    setConditions,
    setSearchText,
  });

  //TODO Preset
  const presets: FilterPreset[] = STUDENT_COLLECTION_PRESETS.map((preset) => {
    const currentFilterValue = query.conditions.find(
      (condition) => condition.fieldId === preset.columnId,
    );
    const selectedFilterValues =
      currentFilterValue?.operator === "in" &&
      Array.isArray(currentFilterValue.value)
        ? currentFilterValue.value
        : [];
    const selected =
      selectedFilterValues.length === preset.value.length &&
      preset.value.every((value) => selectedFilterValues.includes(value));

    return {
      label: preset.label,
      isSelected: selected,
      onToggle: () => {
        if (selected) {
          removeCondition(preset.columnId);
          return;
        }

        upsertCondition({
          fieldId: preset.columnId,
          operator: "in",
          value: [...preset.value],
        } satisfies FilterCondition);
      },
    };
  });

  return {
    config: STUDENT_COLLECTION_VIEW_CONFIG,
    globalFilter,
    presets,
    setGlobalFilter,
    table,
    filterResult,
    metadata,
  };
}
