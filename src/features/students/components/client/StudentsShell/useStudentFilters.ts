"use client";

import { useCallback, useMemo } from "react";
import type { StudentListItem } from "../../../types/student-list-item";
import {
  STUDENT_FILTER_FIELDS,
  STUDENT_FILTER_KEYS,
} from "@/features/search/shared/student-filter-fields";
import { buildFilterDefinitions } from "@/features/search/shared/filter-factory";
import { applyFilters } from "@/features/search/shared/filter-engine";
import { useFilterStore } from "@/features/search/shared/filter-store";

const PRESET_KEYS = {
  alerta: "preset-alerta",
  advertencia: "preset-advertencia",
} as const;

const ALERTA_RANGE: [number, number] = [1, 2];

function toArrayValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (value === null || value === undefined) {
    return [];
  }

  return [String(value)];
}

/**
 * Student リストにフィルターを適用するフック。
 *
 * - definitions は宣言的な field 定義から自動生成し、選択肢は現在の students から導出する
 * - conditions は zustand store（filter モーダルが更新）から取得
 * - 検索ボックスは独立 state を持たず、name filter の condition と同一のものを使う
 */
export function useStudentFilters(students: StudentListItem[]) {
  const conditions = useFilterStore((state) => state.conditions);
  const upsertCondition = useFilterStore((state) => state.upsertCondition);
  const removeCondition = useFilterStore((state) => state.removeCondition);

  const definitions = useMemo(
    () => buildFilterDefinitions(STUDENT_FILTER_FIELDS, students),
    [students],
  );

  const nameDefinition = useMemo(
    () => definitions.find((definition) => definition.key === STUDENT_FILTER_KEYS.name),
    [definitions],
  );

  const nameCondition = conditions.find(
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
    return applyFilters(students, definitions, conditions);
  }, [students, definitions, conditions]);

  const careerCondition = conditions.find(
    (condition) => condition.fieldKey === STUDENT_FILTER_KEYS.career,
  );

  const statusCondition = conditions.find(
    (condition) => condition.fieldKey === STUDENT_FILTER_KEYS.status,
  );

  const isPresetSelected = useCallback(
    (presetKey: "career" | "status" | keyof typeof PRESET_KEYS) => {
      switch (presetKey) {
        case "career":
          return toArrayValue(careerCondition?.value).includes("TIND");
        case "status":
          return toArrayValue(statusCondition?.value).includes("activo");
        case "alerta":
        case "advertencia":
          return conditions.some((condition) => condition.id === PRESET_KEYS[presetKey]);
      }
    },
    [careerCondition?.value, conditions, statusCondition?.value],
  );

  const togglePreset = useCallback(
    (presetKey: "career" | "status" | keyof typeof PRESET_KEYS) => {
      if (presetKey === "career") {
        const currentValues = toArrayValue(careerCondition?.value);
        const nextValues = currentValues.includes("TIND")
          ? currentValues.filter((value) => value !== "TIND")
          : [...currentValues, "TIND"];

        if (nextValues.length === 0) {
          removeCondition(STUDENT_FILTER_KEYS.career);
          return;
        }

        upsertCondition({
          id: STUDENT_FILTER_KEYS.career,
          fieldKey: STUDENT_FILTER_KEYS.career,
          operator: "in",
          value: nextValues,
        });
        return;
      }

      if (presetKey === "status") {
        const currentValues = toArrayValue(statusCondition?.value);
        const nextValues = currentValues.includes("activo")
          ? currentValues.filter((value) => value !== "activo")
          : [...currentValues, "activo"];

        if (nextValues.length === 0) {
          removeCondition(STUDENT_FILTER_KEYS.status);
          return;
        }

        upsertCondition({
          id: STUDENT_FILTER_KEYS.status,
          fieldKey: STUDENT_FILTER_KEYS.status,
          operator: "in",
          value: nextValues,
        });
        return;
      }

      const conditionId = PRESET_KEYS[presetKey];

      if (conditions.some((condition) => condition.id === conditionId)) {
        removeCondition(conditionId);
        return;
      }

      switch (presetKey) {
        case "alerta":
          upsertCondition({
            id: conditionId,
            fieldKey: STUDENT_FILTER_KEYS.reprobado,
            operator: "between",
            value: ALERTA_RANGE,
          });
          return;
        case "advertencia":
          upsertCondition({
            id: conditionId,
            fieldKey: STUDENT_FILTER_KEYS.reprobado,
            operator: "gte",
            value: 3,
          });
          return;
      }
    },
    [careerCondition?.value, conditions, removeCondition, statusCondition?.value, upsertCondition],
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
