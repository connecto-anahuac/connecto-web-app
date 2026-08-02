"use client";

import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import {
  OFFERING_COURSE_VIEW_CONFIG,
} from "@/features/offeringCourse/types/offering-course-filter-fields";
import { useDataSearch } from "@/shared/component/composite/searchtool/useDataSearch";

export function useScheduleBuilderFilters(offeringCourses: OfferingCourse[]) {
  const {
    config,
    metadata,
    gridEntries,
    query,
    searchText,
    setSearchText,
  } = useDataSearch(OFFERING_COURSE_VIEW_CONFIG, offeringCourses);

  return {
    config,
    metadata,
    searchText,
    setSearchText,
    matchingCourseKeys: new Set(
      gridEntries.filter((entry) => entry.isMatch).map((entry) => entry.item.key),
    ),
    hasActiveFilters: query.conditions.length > 0 || query.globalTextQuery.trim().length > 0,
  };
}
