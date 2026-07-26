"use client";

import { useCallback, useMemo } from "react";
import type { FilterCondition, FilterDefinition } from "@/features/search/shared/filter-definition";
import { buildFilterDefinitions } from "@/features/search/shared/filter-factory";

import { STUDENT_GRADE_FILTER_KEYS } from "@/features/student/types/student-grade-filter-fields";
import { useFilterStore } from "@/features/search/components/useFilterStore";
import { FilterField } from "@/features/search/shared/filter-field";


type UseFiltersResult<TItem> = {
    definitions: FilterDefinition<TItem>[];
    hasActiveFilters: boolean;
    conditions: FilterCondition[];
}

export function useFiltersOLD<TItem>(
  fields: FilterField<TItem>[],
  targetFilterableList: TItem[],
):UseFiltersResult<TItem> {
  // TODO textsearcの実装
  const conditions = useFilterStore((state) => state.conditions);
  const upsertCondition = useFilterStore((state) => state.upsertCondition);
  const removeCondition = useFilterStore((state) => state.removeCondition);

  // const FILTER_KEY_LOOKUP: Record<string, boolean> = Object.keys(conditions).reduce(
  //   (acc, key) => {
  //     acc[key] = true;
  //     return acc;
  //   },
  //   {} as Record<string, boolean>,
  // );

  // const FILTER_KEY_LOOKUP: Record<string, boolean> = Object.values(
  //   STUDENT_GRADE_FILTER_KEYS,
  // ).reduce(
  //   (acc, value) => {
  //     acc[value] = true;
  //     return acc;
  //   },
  //   {} as Record<string, boolean>,
  // );


  /*
  const FILTER_KEY_LOOKUP: Record<string, true> = {
    [STUDENT_PLAN_FILTER_KEYS.className]: true,
    [STUDENT_PLAN_FILTER_KEYS.classCodeAndNumber]: true,
    [STUDENT_PLAN_FILTER_KEYS.period]: true,
    [STUDENT_PLAN_FILTER_KEYS.grade]: true,
  };
  */

  // TODO filterを全共通にしなければいらない
  // function getRelevantConditions(conditions: FilterCondition[]) {
  //   return conditions.filter(
  //     (condition) => FILTER_KEY_LOOKUP[condition.fieldKey] === true,
  //   );
  // }

  // const conditions = getRelevantConditions(conditions);

  const definitions = useMemo(
    () => buildFilterDefinitions(fields, targetFilterableList),
    [fields, targetFilterableList],
  );

  //!Todo textsearcの実装
  // const classNameCondition = conditions.find(
  //   (condition) => condition.fieldKey === STUDENT_GRADE_FILTER_KEYS.className,
  // );

  // const searchText =
  //   typeof classNameCondition?.value === "string"
  //     ? classNameCondition.value
  //     : "";

  // const setSearchText = useCallback(
  //   (value: string) => {
  //     if (value === "") {
  //       removeCondition(STUDENT_GRADE_FILTER_KEYS.className);
  //       return;
  //     }

  //     upsertCondition({
  //       id: STUDENT_GRADE_FILTER_KEYS.className,
  //       fieldKey: STUDENT_GRADE_FILTER_KEYS.className,
  //       operator: classNameCondition?.operator ?? "contains",
  //       value,
  //     });
  //   },
  //   [classNameCondition?.operator, removeCondition, upsertCondition],
  // );

  return {
    definitions,
    // searchText,
    // setSearchText,
    hasActiveFilters: conditions.length > 0,
    conditions: conditions
  };
}
