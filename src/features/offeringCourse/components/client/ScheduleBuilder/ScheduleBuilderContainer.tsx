"use client";

import { useMemo } from "react";
import OfferingCoursePanel from "../OfferingCoursePanel/OfferingCoursePanel";
import {
  getEnabledStudentTotal,
  ScheduleBuilderPresenter,
} from "./ScheduleBuilderPresenter";
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
  const displayOfferingCourses = useMemo(
    () =>
      offeringCourses.map((offeringCourse) => {
        const draft = drafts[offeringCourse.key];
        if (!draft) return offeringCourse;

        return {
          ...offeringCourse,
          estimatedNumber: getEnabledStudentTotal(
            draft.enabledStudentIdsByStudyPlan,
          ),
        };
      }),
    [drafts, offeringCourses],
  );
  const {
    config,
    metadata,
    table,
    filterResult,
    globalFilter,
    setGlobalFilter,
  } = useScheduleBuilderFilters(displayOfferingCourses);

  const sidePanel = isPanelOpen ? (
    <OfferingCoursePanel className="h-full w-72 shrink-0" />
  ) : null;

  return (
    <ScheduleBuilderPresenter
      career={career}
      config={config}
      metadata={metadata}
      error={error}
      loading={loading}
      filterResult={filterResult}
      onSearchTextChange={setGlobalFilter}
      offeringCourses={displayOfferingCourses}
      pendingCourseKeys={pendingCourseKeys}
      drafts={drafts}
      searchText={globalFilter}
      selectedCourseKeys={selectedCourseKeys}
      table={table}
	  onOffer={(course) => void offerCourse(course)}
	  onOpen={openCourse}
	  onUnoffer={(course) => void unofferCourse(course)}
	  onSessionCountChange={(course, sessionNumber) => void setCourseSessionNumber(course, sessionNumber)}
	  sidePanel={sidePanel}
    />
  );
}
