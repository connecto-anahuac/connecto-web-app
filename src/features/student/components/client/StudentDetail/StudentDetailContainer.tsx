"use client";

import { StudentDetailPresenter } from "./StudentDetailPresenter";
import { useStaticStudentDetail } from "./useStaticStudentDetail";
import { useFilter } from "@/features/search/shared/useFilter";
import { STUDENT_GRADE_FILTER_FIELDS } from "@/features/student/types/student-grade-filter-fields";

type Props = {
  studentId: string;
};

export function StudentDetailContainer({ studentId }: Props) {
  // const { loading, plan,  summary } = useStudentPlan(studentId);
  const { loading: staticLoading, studentDetail, studentGrades } =
    useStaticStudentDetail(studentId);

  const { definitions, filterableItems } = useFilter(
    STUDENT_GRADE_FILTER_FIELDS,
    studentGrades,
  );

  return (
    <StudentDetailPresenter
      loading={staticLoading}
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
