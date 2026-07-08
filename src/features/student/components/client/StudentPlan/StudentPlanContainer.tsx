"use client";

import { useState } from "react";
import { StudentPlanPresenter } from "./StudentPlanPresenter";
import { useStudentPlan } from "./useStudentPlan";
import { useStudentPlanFilters } from "./useStudentPlanFilters";

type Props = {
  studentId: string;
};

export function StudentPlanContainer({ studentId }: Props) {
  const { loading, plan, student, summary } = useStudentPlan(studentId);
  const {
    filteredPlan,
    definitions,
    searchText,
    setSearchText,
  } = useStudentPlanFilters(plan);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <StudentPlanPresenter
      loading={loading}
      plan={filteredPlan}
      student={student}
      summary={summary}
      definitions={definitions}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      isFilterOpen={isFilterOpen}
      onFilterToggle={() => setIsFilterOpen((open) => !open)}
    />
  );
}