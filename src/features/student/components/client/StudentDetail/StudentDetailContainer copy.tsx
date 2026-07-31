"use client";

import { useOptions } from "@/features/search/components/option/useOptions";
import { StudentDetailPresenter } from "./StudentDetailPresenter";
import { useStaticStudentDetail } from "./useStaticStudentDetail";
import { useStudentClassTable } from "./useStudentClassTable";
import { STUDENT_GRADE_VIEW_CONFIG } from "@/features/student/types/studentClassViewConfig";

type Props = {
  studentId: string;
};

export function StudentDetailContainer({ studentId }: Props) {
  const { loading: staticLoading, studentDetail, studentGrades } =
    useStaticStudentDetail(studentId);

  const { config, globalFilter, presets, setGlobalFilter, table } =
    useStudentClassTable(studentGrades);

  const {} = useOptions({
    config: STUDENT_GRADE_VIEW_CONFIG,
    data: studentGrades,
    cacheId: "studentGrade",
  });
  return (
    <StudentDetailPresenter
      loading={staticLoading}
      studentGrades={studentGrades}
      studentDetail={studentDetail}
      table={table}
      tableConfig={config}
      searchText={globalFilter}
      onSearchTextChange={setGlobalFilter}
      presets={presets}
      // isFilterOpen={isFilterOpen}
      // onFilterToggle={() => setIsFilterOpen((open) => !open)}
    />

    
  );
}
