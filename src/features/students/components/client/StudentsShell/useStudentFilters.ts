"use client";

import { useCallback, useMemo } from "react";
import type { StudentListItem } from "../../../types/student-list-item";
import {
  STUDENT_FILTER_KEYS,
  STUDENT_FILTER_FIELDS,
} from "@/features/student/types/studentFilterConfigs";
import { useDataSearch } from "@/features/search/shared/useDataSearch";
import type { FilterCondition } from "@/features/search/shared/filterDefinition";
import {
  getStudentPresetNextConditions,
  isStudentPresetSelected,
  type StudentPresetKey,
} from "./studentPresetSync";
import { useDataSearchStore } from "@/features/search/components/Provider/useFilterStore";

const STUDENT_FILTER_KEY_LOOKUP: Record<string, true> = {
  [STUDENT_FILTER_KEYS.career]: true,
  [STUDENT_FILTER_KEYS.name]: true,
  [STUDENT_FILTER_KEYS.status]: true,
  [STUDENT_FILTER_KEYS.currentSemester]: true,
  [STUDENT_FILTER_KEYS.plan]: true,
  [STUDENT_FILTER_KEYS.failCount]: true,
};

function getRelevantConditions(conditions: readonly FilterCondition[]) {
  return conditions.filter((condition) => STUDENT_FILTER_KEY_LOOKUP[condition.fieldKey] === true);
}

export function useStudentFilters(students: StudentListItem[]) {
  const { definitions, listEntries, searchText, setSearchText } = useDataSearch(
    STUDENT_FILTER_FIELDS,
    students,
  );
  const conditions = useDataSearchStore((state) => state.conditions);
  const upsertCondition = useDataSearchStore((state) => state.upsertCondition);
  const removeCondition = useDataSearchStore((state) => state.removeCondition);
  const relevantConditions = getRelevantConditions(conditions);

  const isPresetSelected = useCallback(
    (presetKey: StudentPresetKey) => isStudentPresetSelected(presetKey, relevantConditions),
    [relevantConditions],
  );

  const togglePreset = useCallback(
    (presetKey: StudentPresetKey) => {
      const nextConditions = getStudentPresetNextConditions(relevantConditions, presetKey);
      const nextCondition = nextConditions.find((condition) => {
        if (presetKey === "career") return condition.fieldKey === STUDENT_FILTER_KEYS.career;
        if (presetKey === "status") return condition.fieldKey === STUDENT_FILTER_KEYS.status;
        return condition.fieldKey === STUDENT_FILTER_KEYS.failCount;
      });
      const fieldKey = presetKey === "career"
        ? STUDENT_FILTER_KEYS.career
        : presetKey === "status"
          ? STUDENT_FILTER_KEYS.status
          : STUDENT_FILTER_KEYS.failCount;
      if (!nextCondition) {
        removeCondition(fieldKey);
        return;
      }
      upsertCondition(nextCondition);
    },
    [relevantConditions, removeCondition, upsertCondition],
  );

  return {
    filteredStudents: listEntries.map((entry) => entry.item),
    definitions,
    searchText,
    setSearchText,
    presetState: useMemo(
      () => ({
        career: isPresetSelected("career"),
        status: isPresetSelected("status"),
        alerta: isPresetSelected("alerta"),
        advertencia: isPresetSelected("advertencia"),
      }),
      [isPresetSelected],
    ),
    togglePreset,
  };
}
