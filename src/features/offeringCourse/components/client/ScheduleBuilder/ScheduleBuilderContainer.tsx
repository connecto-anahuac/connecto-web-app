"use client";

import { useState } from "react";
import OfferingCoursePanel from "../OfferingCoursePanel/OfferingCoursePanel";
import { ScheduleBuilderPresenter } from "./ScheduleBuilderPresenter";
import { ScheduleBuilderStateProvider } from "./ScheduleBuilderStateProvider";
import { useScheduleBuilder } from "./useScheduleBuilder";
import { useScheduleBuilderFilters } from "./useScheduleBuilderFilters";

type Props = {
  career: string;
};

export function ScheduleBuilderContainer({ career }: Props) {
  return (
    <ScheduleBuilderStateProvider>
      <ScheduleBuilderContainerContent career={career} />
    </ScheduleBuilderStateProvider>
  );
}

function ScheduleBuilderContainerContent({ career }: Props) {
  const {
    error,
    loading,
    offeringCourses,
    pendingCourseKeys,
    drafts,
    selectedCourseKeys,
    isPanelOpen,
    openCourse,
    offerCourse,
    unofferCourse,
    setCourseSessionNumber,
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

  const sidePanel = isPanelOpen ? (
    <OfferingCoursePanel className="h-full w-72 shrink-0" />
  ) : null;

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
      drafts={drafts}
      searchText={searchText}
      selectedCourseKeys={selectedCourseKeys}
	  onOffer={(course) => void offerCourse(course)}
	  onOpen={openCourse}
	  onUnoffer={(course) => void unofferCourse(course)}
	  onSessionCountChange={(course, sessionNumber) => void setCourseSessionNumber(course, sessionNumber)}
	  sidePanel={sidePanel}
    />
  );
}
