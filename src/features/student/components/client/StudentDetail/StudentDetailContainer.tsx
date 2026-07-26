"use client";

import { StudentDetailPresenter } from "./StudentDetailPresenter";
import { useStaticStudentDetail } from "./useStaticStudentDetail";
import { useFilter } from "@/features/search/shared/useFilter";
import {
  STUDENT_GRADE_FILTER_FIELDS as STUDENT_GRADE_FILTER_CONFIGS,
  STUDENT_GRADE_FILTER_PRESET,
} from "@/features/student/types/studentGradeFilterConfigs";
import { useBindingFilterPresets } from "@/features/search/shared/useBindingFilterPresets";

type Props = {
  studentId: string;
};

export function StudentDetailContainer({ studentId }: Props) {
  // const { loading, plan,  summary } = useStudentPlan(studentId);
  const { loading: staticLoading, studentDetail, studentGrades } =
    useStaticStudentDetail(studentId);

  const { definitions, filterableItems } = useFilter(
    STUDENT_GRADE_FILTER_CONFIGS,
    studentGrades,
  );
  const presets = useBindingFilterPresets(STUDENT_GRADE_FILTER_PRESET);

  return (
    <StudentDetailPresenter
      loading={staticLoading}
      filterableItems={filterableItems}
      studentDetail={studentDetail}
      definitions={definitions}
      searchText={"searchText"}
      onSearchTextChange={() => {}}
      presets={presets}
      // isFilterOpen={isFilterOpen}
      // onFilterToggle={() => setIsFilterOpen((open) => !open)}
    />

    
  );
}
