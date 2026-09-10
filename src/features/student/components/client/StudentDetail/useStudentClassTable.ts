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
import type { StudentClassItem } from "@/features/student/types";
import {
  STATUS_PRESETS,
  STUDENT_GRADE_VIEW_CONFIG,
} from "@/features/student/types/studentClassViewConfig";
import { useTable } from "@/shared/component/composite/table/hooks/useTable";

const getStudentGradeRowId: GetItemId<StudentClassItem> = (row) => row.id;

export function useStudentClassTable(data: readonly StudentClassItem[]) {
  const query = useDataSearchQuery();
  const {
    removeCondition,
    setConditions,
    setSearchText,
    upsertCondition,
  } = useDataSearchActions();
  const { globalFilter, setGlobalFilter, table, filterResult, metadata } = useTable({
    config: STUDENT_GRADE_VIEW_CONFIG,
    data,
    getRowId: getStudentGradeRowId,
    query,
    setConditions,
    setSearchText,
  });

  const presets: FilterPreset[] = STATUS_PRESETS.map((preset) => {
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
    config: STUDENT_GRADE_VIEW_CONFIG,
    globalFilter,
    presets,
    setGlobalFilter,
    table,
    filterResult,
    metadata,
  };
}
