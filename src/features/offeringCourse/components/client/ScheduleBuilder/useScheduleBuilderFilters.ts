"use client";

import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import {
  OFFERING_COURSE_FILTER_FIELDS,
} from "@/features/offeringCourse/types/offering-course-filter-fields";
import { useDataSearch } from "@/features/search/shared/useDataSearch";

export function useScheduleBuilderFilters(offeringCourses: OfferingCourse[]) {
  const {
    definitions,
    gridEntries,
    query,
    searchText,
    setSearchText,
  } = useDataSearch(OFFERING_COURSE_FILTER_FIELDS, offeringCourses);

  return {
    definitions,
    searchText,
    setSearchText,
    matchingCourseKeys: new Set(
      gridEntries.filter((entry) => entry.isMatch).map((entry) => entry.item.key),
    ),
    hasActiveFilters: query.conditions.length > 0 || query.text.trim().length > 0,
  };
}
