"use client";

import type { FilterPreset } from "@/features/search/shared/filterPreset.type";
import type { StudentClassItem } from "@/features/student/types";
import {
  STATUS_PRESETS,
  STUDENT_GRADE_VIEW_CONFIG,
} from "@/features/student/types/studentClassViewConfig";
import {
  defineFilterCondition,
  type FilterCondition,
} from "@/features/table/type";
import { useTable } from "@/features/table/useTable";

export function useStudentClassTable(data: readonly StudentClassItem[]) {
  const { globalFilter, setGlobalFilter, table } = useTable({
    config: STUDENT_GRADE_VIEW_CONFIG,
    data,
  });

  const presets: FilterPreset[] = STATUS_PRESETS.map((preset) => {
    const column = table.getColumn(preset.columnId);
    const currentFilterValue = column?.getFilterValue() as
      | FilterCondition
      | undefined;
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
      onToggle: () =>
        column?.setFilterValue(
          selected
            ? undefined
            : {
                columnId: preset.columnId,
                operator: "in",
                value: [...preset.value],
              } satisfies FilterCondition,
        ),
    };
  });

  return {
    config: STUDENT_GRADE_VIEW_CONFIG,
    globalFilter,
    presets,
    setGlobalFilter,
    table,
  };
}
