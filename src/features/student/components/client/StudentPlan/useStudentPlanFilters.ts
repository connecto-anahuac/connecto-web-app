"use client";

import { useCallback, useMemo } from "react";
import type { FilterCondition } from "@/features/search/shared/filter-definition";
import { buildFilterDefinitions } from "@/features/search/shared/filter-factory";
import { applyFilters } from "@/features/search/shared/filter-engine";
import { useFilterStore } from "@/features/search/shared/filter-store";
import {
  STUDENT_PLAN_FILTER_FIELDS,
  STUDENT_PLAN_FILTER_KEYS,
} from "@/features/student/types/student-plan-filter-fields";
import type { StudentClassItem } from "@/features/student/types";

const STUDENT_PLAN_FILTER_KEY_LOOKUP: Record<string, true> = {
  [STUDENT_PLAN_FILTER_KEYS.className]: true,
  [STUDENT_PLAN_FILTER_KEYS.classCodeAndNumber]: true,
  [STUDENT_PLAN_FILTER_KEYS.period]: true,
  [STUDENT_PLAN_FILTER_KEYS.grade]: true,
};

function getRelevantConditions(conditions: FilterCondition[]) {
  return conditions.filter(
    (condition) => STUDENT_PLAN_FILTER_KEY_LOOKUP[condition.fieldKey] === true,
  );
}

export function useStudentPlanFilters(plan: StudentClassItem[]) {
  const conditions = useFilterStore((state) => state.conditions);
  const upsertCondition = useFilterStore((state) => state.upsertCondition);
  const removeCondition = useFilterStore((state) => state.removeCondition);

  const relevantConditions = getRelevantConditions(conditions);

  const definitions = useMemo(
    () => buildFilterDefinitions(STUDENT_PLAN_FILTER_FIELDS, plan),
    [plan],
  );

  const classNameCondition = relevantConditions.find(
    (condition) => condition.fieldKey === STUDENT_PLAN_FILTER_KEYS.className,
  );

  const searchText = typeof classNameCondition?.value === "string" ? classNameCondition.value : "";

  const setSearchText = useCallback(
    (value: string) => {
      if (value === "") {
        removeCondition(STUDENT_PLAN_FILTER_KEYS.className);
        return;
      }

      upsertCondition({
        id: STUDENT_PLAN_FILTER_KEYS.className,
        fieldKey: STUDENT_PLAN_FILTER_KEYS.className,
        operator: classNameCondition?.operator ?? "contains",
        value,
      });
    },
    [classNameCondition?.operator, removeCondition, upsertCondition],
  );

  const filteredPlan = useMemo(
    () => applyFilters(plan, definitions, relevantConditions),
    [plan, definitions, relevantConditions],
  );

  const matchingPlanIds = useMemo(
    () => new Set(filteredPlan.map((item) => item.id)),
    [filteredPlan],
  );

  return {
    definitions,
    searchText,
    setSearchText,
    matchingPlanIds,
    hasActiveFilters: relevantConditions.length > 0,
  };
}