"use client";

import { DataSearchScopeProvider } from "@/shared/store/filter/FilterProvider";
import { StudentDetailPresenter } from "./StudentDetailPresenter";
import {
  buildProfileInformations,
  buildStudentDetailOverviewCards,
} from "./studentDetailViewModel";
import { useStaticStudentDetail } from "./useStaticStudentDetail";
import { useStudentClassTable } from "./useStudentClassTable";
import { useStudentDetailTabs } from "./useStudentDetailTabs";

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
  const { selectedTab, onTabChange } = useStudentDetailTabs();
  const { loading, studentDetail, studentGrades, totalSemesters } =
    useStaticStudentDetail(studentId);
  const {
    config,
    filterResult,
    globalFilter,
    metadata,
    presets,
    setGlobalFilter,
    table,
  } = useStudentClassTable(studentGrades);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!studentDetail) {
    return <div>Student not found</div>;
  }

  return (
    <StudentDetailPresenter
      profileInformations={buildProfileInformations(studentDetail)}
      imgSrc={studentDetail.imgSrc ?? "/data/avator.png"}
      status={studentDetail.profile.status}
      planTotalSemesters={totalSemesters}
      {...buildStudentDetailOverviewCards(
        studentDetail,
        studentGrades,
        totalSemesters,
      )}
      studentGrades={studentGrades}
      table={table}
      tableConfig={config}
      searchText={globalFilter}
      onSearchTextChange={setGlobalFilter}
      presets={presets}
      filterResult={filterResult}
      metadata={metadata}
      selectedTab={selectedTab}
      onTabChange={onTabChange}
    />
  );
}
