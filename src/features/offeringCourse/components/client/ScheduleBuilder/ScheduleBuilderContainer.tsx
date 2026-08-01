"use client";

import { useState } from "react";
import { ScheduleBuilderPresenter } from "./ScheduleBuilderPresenter";
import { useScheduleBuilder } from "./useScheduleBuilder";
import { useScheduleBuilderFilters } from "./useScheduleBuilderFilters";

type Props = {
  career: string;
};

export function ScheduleBuilderContainer({ career }: Props) {
  const {
    error,
    loading,
    offeringCourses,
    pendingCourseKeys,
    selectedCourseKeys,
    toggleOfferingCourse,
  } = useScheduleBuilder(career);
  const {
    config,
    metadata,
    searchText,
    setSearchText,
    matchingCourseKeys,
    hasActiveFilters,
  } = useScheduleBuilderFilters(offeringCourses);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <ScheduleBuilderPresenter
      career={career}
      config={config}
      metadata={metadata}
      error={error}
      hasActiveFilters={hasActiveFilters}
      isFilterOpen={isFilterOpen}
      loading={loading}
      matchingCourseKeys={matchingCourseKeys}
      onFilterToggle={() => setIsFilterOpen((open) => !open)}
      onSearchTextChange={setSearchText}
      offeringCourses={offeringCourses}
      pendingCourseKeys={pendingCourseKeys}
      searchText={searchText}
      selectedCourseKeys={selectedCourseKeys}
      onToggle={toggleOfferingCourse}
    />
  );
}
