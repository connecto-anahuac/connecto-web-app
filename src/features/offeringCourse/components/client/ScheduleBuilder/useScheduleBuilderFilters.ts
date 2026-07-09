"use client";

import { useCallback, useMemo } from "react";
import { applyFilters } from "@/features/search/shared/filter-engine";
import type { FilterCondition } from "@/features/search/shared/filter-definition";
import { buildFilterDefinitions } from "@/features/search/shared/filter-factory";
import {
  OFFERING_COURSE_FILTER_FIELDS,
  OFFERING_COURSE_FILTER_KEYS,
} from "@/features/offeringCourse/types/offering-course-filter-fields";
import { useFilterStore } from "@/features/search/shared/filter-store";
import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";

const OFFERING_COURSE_FILTER_KEY_LOOKUP: Record<string, true> = {
  [OFFERING_COURSE_FILTER_KEYS.className]: true,
};

function isOfferingCourseFilterKey(fieldKey: string) {
  return OFFERING_COURSE_FILTER_KEY_LOOKUP[fieldKey] === true;
}

function getRelevantConditions(conditions: FilterCondition[]) {
  return conditions.filter((condition) =>
    isOfferingCourseFilterKey(condition.fieldKey),
  );
}

export function useScheduleBuilderFilters(offeringCourses: OfferingCourse[]) {
  const conditions = useFilterStore((state) => state.conditions);
  const upsertCondition = useFilterStore((state) => state.upsertCondition);
  const removeCondition = useFilterStore((state) => state.removeCondition);

  const relevantConditions = getRelevantConditions(conditions);

  const definitions = useMemo(
    () => buildFilterDefinitions(OFFERING_COURSE_FILTER_FIELDS, offeringCourses),
    [offeringCourses],
  );

  const classNameCondition = relevantConditions.find(
    (condition) => condition.fieldKey === OFFERING_COURSE_FILTER_KEYS.className,
  );

  const searchText =
    typeof classNameCondition?.value === "string" ? classNameCondition.value : "";

  const setSearchText = useCallback(
    (value: string) => {
      if (value === "") {
        removeCondition(OFFERING_COURSE_FILTER_KEYS.className);
        return;
      }

      upsertCondition({
        id: OFFERING_COURSE_FILTER_KEYS.className,
        fieldKey: OFFERING_COURSE_FILTER_KEYS.className,
        operator: classNameCondition?.operator ?? "contains",
        value,
      });
    },
    [classNameCondition?.operator, removeCondition, upsertCondition],
  );

  const filteredOfferingCourses = useMemo(
    () => applyFilters(offeringCourses, definitions, relevantConditions),
    [offeringCourses, definitions, relevantConditions],
  );

  const matchingCourseKeys = useMemo(
    () => new Set(filteredOfferingCourses.map((item) => item.key)),
    [filteredOfferingCourses],
  );

  return {
    definitions,
    searchText,
    setSearchText,
    matchingCourseKeys,
    hasActiveFilters: relevantConditions.length > 0,
  };
}