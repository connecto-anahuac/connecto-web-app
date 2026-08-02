"use client";

import { DataSearchScopeProvider } from "@/shared/store/filter/FilterProvider";
import { StudentDetailPresenter } from "./StudentDetailPresenter";
import { useStaticStudentDetail } from "./useStaticStudentDetail";
import { useStudentClassTable } from "./useStudentClassTable";

type Props = {
  studentId: string;
};

export function StudentDetailContainer({ studentId }: Props) {
  return (
    <DataSearchScopeProvider scopeId={`student:grades:${studentId}`}>
      <StudentDetailContent studentId={studentId} />
    </DataSearchScopeProvider>
  );
}

function StudentDetailContent({ studentId }: Props) {
  const { loading: staticLoading, studentDetail, studentGrades } =
    useStaticStudentDetail(studentId);

  const { config, globalFilter, presets, setGlobalFilter, table, filterResult, metadata } =
    useStudentClassTable(studentGrades);

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
      filterResult={filterResult}
      metadata={metadata}
    />
  );
}
