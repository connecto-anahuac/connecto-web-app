"use client";

import { useCallback, useMemo } from "react";
import type { StudentListItem } from "../../../types/student-list-item";
import {
  STUDENT_FILTER_FIELDS,
  STUDENT_FILTER_KEYS,
} from "@/features/student/types/studentFilterConfigs";
import { buildFilterDefinitions } from "@/features/search/shared/filterFactory";
import { applyFilters } from "@/features/search/shared/filterEngine";
import { createFilterStore } from "@/features/search/shared/filterStore";
import type { FilterCondition } from "@/features/search/shared/filterDefinition";
import {
  getStudentPresetNextConditions,
  isStudentPresetSelected,
  type StudentPresetKey,
} from "./studentPresetSync";
import { useFilterStoreProvider } from "@/features/search/components/Provider/useFilterStore";

const STUDENT_FILTER_KEY_LOOKUP: Record<string, true> = {
  [STUDENT_FILTER_KEYS.career]: true,
  [STUDENT_FILTER_KEYS.name]: true,
  [STUDENT_FILTER_KEYS.status]: true,
  [STUDENT_FILTER_KEYS.currentSemester]: true,
  [STUDENT_FILTER_KEYS.plan]: true,
  [STUDENT_FILTER_KEYS.failCount]: true,
};

function getRelevantConditions(conditions: FilterCondition[]) {
  return conditions.filter(
    (condition) => STUDENT_FILTER_KEY_LOOKUP[condition.fieldKey] === true,
  );
}

/**
 * Student リストにフィルターを適用するフック。
 *
 * - definitions は宣言的な field 定義から自動生成し、選択肢は現在の students から導出する
 * - conditions は zustand store（filter モーダルが更新）から取得
 * - 検索ボックスは独立 state を持たず、name filter の condition と同一のものを使う
 */
export function useStudentFilters(students: StudentListItem[]) {
  // const conditions = createFilterStore((state) => state.conditions);
  // const upsertCondition = createFilterStore((state) => state.upsertCondition);
  // const removeCondition = createFilterStore((state) => state.removeCondition);
  const conditions = useFilterStoreProvider((state) => state.conditions);
  const upsertCondition = useFilterStoreProvider((state) => state.upsertCondition);
  const removeCondition = useFilterStoreProvider((state) => state.removeCondition);
  const relevantConditions = getRelevantConditions(conditions);

  const definitions = useMemo(
    () => buildFilterDefinitions(STUDENT_FILTER_FIELDS, students),
    [students],
  );

  const nameDefinition = useMemo(
    () => definitions.find((definition) => definition.key === STUDENT_FILTER_KEYS.name),
    [definitions],
  );

  const nameCondition = relevantConditions.find(
    (condition) => condition.fieldKey === STUDENT_FILTER_KEYS.name,
  );

  const searchText = typeof nameCondition?.value === "string" ? nameCondition.value : "";

  const setSearchText = useCallback(
    (value: string) => {
      if (!nameDefinition) {
        return;
      }

      if (value === "") {
        removeCondition(STUDENT_FILTER_KEYS.name);
        return;
      }

      upsertCondition({
        id: STUDENT_FILTER_KEYS.name,
        fieldKey: STUDENT_FILTER_KEYS.name,
        operator: nameCondition?.operator ?? "contains",
        value,
      });
    },
    [nameCondition?.operator, nameDefinition, removeCondition, upsertCondition],
  );

  const filteredStudents = useMemo(() => {
    return applyFilters(students, definitions, relevantConditions);
  }, [students, definitions, relevantConditions]);

  const isPresetSelected = useCallback(
    (presetKey: StudentPresetKey) => isStudentPresetSelected(presetKey, relevantConditions),
    [relevantConditions],
  );

  const togglePreset = useCallback(
    (presetKey: StudentPresetKey) => {
      const nextConditions = getStudentPresetNextConditions(relevantConditions, presetKey);

      const nextCondition = nextConditions.find((condition) => {
        switch (presetKey) {
          case "career":
            return condition.fieldKey === STUDENT_FILTER_KEYS.career;
          case "status":
            return condition.fieldKey === STUDENT_FILTER_KEYS.status;
          case "alerta":
          case "advertencia":
            return condition.fieldKey === STUDENT_FILTER_KEYS.failCount;
        }
      });

      switch (presetKey) {
        case "career":
          if (!nextCondition) {
            removeCondition(STUDENT_FILTER_KEYS.career);
            return;
          }
          upsertCondition(nextCondition);
          return;
        case "status":
          if (!nextCondition) {
            removeCondition(STUDENT_FILTER_KEYS.status);
            return;
          }
          upsertCondition(nextCondition);
          return;
        case "alerta":
        case "advertencia":
          if (!nextCondition) {
            removeCondition(STUDENT_FILTER_KEYS.failCount);
            return;
          }
          upsertCondition(nextCondition);
          return;
      }
    },
    [relevantConditions, removeCondition, upsertCondition],
  );

  const presetState = useMemo(
    () => ({
      career: isPresetSelected("career"),
      status: isPresetSelected("status"),
      alerta: isPresetSelected("alerta"),
      advertencia: isPresetSelected("advertencia"),
    }),
    [isPresetSelected],
  );

  return {
    filteredStudents,
    definitions,
    searchText,
    setSearchText,
    presetState,
    togglePreset,
  };
}
