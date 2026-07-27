"use client";

import { StudentDetailPresenter } from "./StudentDetailPresenter";
import { useStaticStudentDetail } from "./useStaticStudentDetail";
import { useDataSearch } from "@/features/search/shared/useDataSearch";
import {
  STUDENT_GRADE_FILTER_FIELDS as STUDENT_GRADE_FILTER_CONFIGS,
  STUDENT_GRADE_FILTER_PRESET,
} from "@/features/student/types/studentGradeFilterConfigs";
import { useBindingFilterPresets } from "@/features/search/shared/useBindingFilterPresets";

type Props = {
  studentId: string;
};

export function StudentDetailContainer({ studentId }: Props) {
  const { loading: staticLoading, studentDetail, studentGrades } =
    useStaticStudentDetail(studentId);

  const { definitions, gridEntries, searchText, setSearchText } = useDataSearch(
    STUDENT_GRADE_FILTER_CONFIGS,
    studentGrades,
  );
  const presets = useBindingFilterPresets(STUDENT_GRADE_FILTER_PRESET);

  return (
    <StudentDetailPresenter
      loading={staticLoading}
      filterableItems={gridEntries}
      studentDetail={studentDetail}
      definitions={definitions}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      presets={presets}
      // isFilterOpen={isFilterOpen}
      // onFilterToggle={() => setIsFilterOpen((open) => !open)}
    />

    
  );
}
