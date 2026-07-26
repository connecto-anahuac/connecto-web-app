"use client";

import { useState } from "react";
import { StudentDetailPresenter } from "./StudentDetailPresenter";
import { useStudentDetail } from "./useStudentDetail";
import { useStaticStudentDetail } from "./useStaticStudentDetail";
import ContentTitleSection from "@/components/ContentTitleSection";
import DataSection from "@/components/datasection/DataSection";
import { StudentDiagram } from "./StudentDiagram";

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
    // searchText,
    // setSearchText,
    hasActiveFilters,
    filteredItems,
    allItems,
    matchingPlanIds,
  } = useStudentDetail(studentId);

  return (
    <StudentDetailPresenter
      loading={staticLoading && DynamicLoading}
      allGrades={allItems}
      filteredGrades={filteredItems}
      studentDetail={studentDetail}
      definitions={definitions}
      searchText={"searchText"}
      onSearchTextChange={() => {}}
      matchingPlanIds={matchingPlanIds}
      hasActiveFilters={hasActiveFilters}
      // isFilterOpen={isFilterOpen}
      // onFilterToggle={() => setIsFilterOpen((open) => !open)}
    />

    
  );
}
