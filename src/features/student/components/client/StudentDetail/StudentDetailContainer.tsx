"use client";

import { useState } from "react";
import { StudentDetailPresenter } from "./StudentDetailPresenter";
import { useStudentDetail } from "./useStudentDetail";
import { useStaticStudentDetail } from "./useStaticStudentDetail";

type Props = {
  studentId: string;
};

export function StudentDetailContainer({ studentId }: Props) {
  // const { loading, plan,  summary } = useStudentPlan(studentId);
  const { loading: staticLoading, studentDetail } =
    useStaticStudentDetail(studentId);

  const {
    loading: DynamicLoading,
    definitions,
    searchText,
    setSearchText,
    hasActiveFilters,
    filteredItems,
    allItems,
    matchingPlanIds,
  } = useStudentDetail(studentId);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <StudentDetailPresenter
      loading={staticLoading && DynamicLoading}
      allGrades={allItems}
      filteredGrades={filteredItems}
      studentDetail={studentDetail}
      definitions={definitions}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      matchingPlanIds={matchingPlanIds}
      hasActiveFilters={hasActiveFilters}
      isFilterOpen={isFilterOpen}
      onFilterToggle={() => setIsFilterOpen((open) => !open)}
    />
  );
}
