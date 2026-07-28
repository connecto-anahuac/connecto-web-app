"use client";

import type { FilterPreset } from "@/features/search/shared/filterPreset.type";
import type { StudentClassItem } from "@/features/student/types";
import { STUDENT_GRADE_VIEW_CONFIG } from "@/features/student/types/studentClassViewConfig";
import { useTable } from "@/features/table/useTable";

const STATUS_PRESETS = [
  { label: "Reprobado", columnId: "status", value: ["failed"] },
  { label: "Aprobado", columnId: "status", value: ["passed"] },
  { label: "Cruzado", columnId: "status", value: ["isTaking"] },
  { label: "Posibles", columnId: "status", value: ["enrollable"] },
  {
    label: "Bloqueado",
    columnId: "status",
    value: ["lockedByPreRequisites", "lockedByOthers"],
  },
] as const;

export function useStudentClassTable(data: readonly StudentClassItem[]) {
  const { globalFilter, setGlobalFilter, table } = useTable({
    config: STUDENT_GRADE_VIEW_CONFIG,
    data,
  });

  const presets: FilterPreset[] = STATUS_PRESETS.map((preset) => {
    const column = table.getColumn(preset.columnId);

    //TODO getfiltervalueの型調査。string, string[]?
    const current = column?.getFilterValue();
    const selected =
      Array.isArray(current) &&
      current.length === preset.value.length &&
      preset.value.every((value) => current.includes(value));
    return {
      label: preset.label,
      isSelected: selected,
      //TODO undefineセットしていい？
      onToggle: () => column?.setFilterValue(selected ? undefined : [...preset.value]),
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
