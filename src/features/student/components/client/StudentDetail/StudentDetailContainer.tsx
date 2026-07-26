"use client";

import { StudentDetailPresenter } from "./StudentDetailPresenter";
import { useStaticStudentDetail } from "./useStaticStudentDetail";
import { useFilter } from "@/features/search/shared/useFilter";
import { fetchStudentPlan } from "@/external/handler/student/query.client";
import { STUDENT_GRADE_FILTER_FIELDS } from "@/features/student/types/student-grade-filter-fields";
import { toStudentClassItemUI } from "@/features/student/types";

type Props = {
  studentId: string;
};

export function StudentDetailContainer({ studentId }: Props) {
  // const { loading, plan,  summary } = useStudentPlan(studentId);
  const { loading: staticLoading, studentDetail } =
    useStaticStudentDetail(studentId);

  const { loading: DynamicLoading,
    definitions,
    filterableItems } = useFilter(STUDENT_GRADE_FILTER_FIELDS,()=>fetchStudentPlan(studentId),toStudentClassItemUI);

  return (
    <StudentDetailPresenter
      loading={staticLoading && DynamicLoading}
      filterableItems={filterableItems}
      studentDetail={studentDetail}
      definitions={definitions}
      searchText={"searchText"}
      onSearchTextChange={() => {}}
      // isFilterOpen={isFilterOpen}
      // onFilterToggle={() => setIsFilterOpen((open) => !open)}
    />

    
  );
}
