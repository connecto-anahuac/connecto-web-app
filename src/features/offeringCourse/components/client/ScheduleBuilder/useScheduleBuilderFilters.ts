"use client";

import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import {
  OFFERING_COURSE_VIEW_CONFIG,
} from "@/features/offeringCourse/types/offering-course-filter-fields";
import { useTable } from "@/shared/component/composite/table/hooks/useTable";
import {
  useDataSearchActions,
  useDataSearchQuery,
} from "@/shared/store/filter/useFilterStore";
import type { GetItemId } from "@/shared/service/dataPipeline/filterDefinition";

const getOfferingCourseRowId: GetItemId<OfferingCourse> = (course) => course.key;

export function useScheduleBuilderFilters(
  offeringCourses: readonly OfferingCourse[],
) {
  const query = useDataSearchQuery();
  const { setConditions, setSearchText } = useDataSearchActions();
  const { filterResult, globalFilter, metadata, setGlobalFilter, table } = useTable({
    config: OFFERING_COURSE_VIEW_CONFIG,
    data: offeringCourses,
    getRowId: getOfferingCourseRowId,
    query,
    setConditions,
    setSearchText,
  });

  return {
    config: OFFERING_COURSE_VIEW_CONFIG,
    filterResult,
    metadata,
    globalFilter,
    setGlobalFilter,
    table,
  };
}
