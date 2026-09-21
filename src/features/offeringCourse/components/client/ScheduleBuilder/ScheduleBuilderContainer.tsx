"use client";

import { useMemo } from "react";
import OfferingCoursePanel from "../OfferingCoursePanel/OfferingCoursePanel";
import { getOfferingCoursePanelTotal } from "../OfferingCoursePanel/useOfferingCoursePanel";
import {
  getEnabledStudentTotal,
  ScheduleBuilderPresenter,
} from "./ScheduleBuilderPresenter";
import { ScheduleBuilderStateProvider } from "./ScheduleBuilderStateProvider";
import { useScheduleBuilder } from "./useScheduleBuilder";
import { useScheduleBuilderFilters } from "./useScheduleBuilderFilters";

type Props = {
  career: string;
  period: string;
};

export function ScheduleBuilderContainer({ career, period }: Props) {
  return (
    <ScheduleBuilderStateProvider key={`${career}:${period}`}>
      <ScheduleBuilderContainerContent career={career} period={period} />
    </ScheduleBuilderStateProvider>
  );
}

function ScheduleBuilderContainerContent({ career, period }: Props) {
  const {
    courseDetailsByKey,
    error,
    loading,
    offeringCourses,
    pendingCourseKeys,
    drafts,
    selectedCourseKeys,
    selectedCourseKey,
    semesterEnabledByCourse,
    closePanel,
    openCourse,
    offerCourse,
    unofferCourse,
    setCourseSessionNumber,
  } = useScheduleBuilder(career, period);
  const displayOfferingCourses = useMemo(
    () =>
      offeringCourses.map((offeringCourse) => {
        const draft = drafts[offeringCourse.key];
        if (!draft) return offeringCourse;
        const detail = courseDetailsByKey[offeringCourse.key];

        const estimatedNumber = detail
          ? getOfferingCoursePanelTotal(
              detail,
              draft.enabledStudentIdsByStudyPlan,
              semesterEnabledByCourse[offeringCourse.key] ?? {},
            )
          : getEnabledStudentTotal(draft.enabledStudentIdsByStudyPlan);

        return {
          ...offeringCourse,
          estimatedNumber,
        };
      }),
    [
      courseDetailsByKey,
      drafts,
      offeringCourses,
      semesterEnabledByCourse,
    ],
  );
  const {
    config,
    metadata,
    table,
    filterResult,
    globalFilter,
    setGlobalFilter,
  } = useScheduleBuilderFilters(displayOfferingCourses);
  const selectedOfferingCourse = selectedCourseKey
    ? displayOfferingCourses.find((course) => course.key === selectedCourseKey)
    : undefined;

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
	  onClosePanel={closePanel}
	  onUnoffer={(course) => void unofferCourse(course)}
	  onSessionCountChange={(course, sessionNumber) => void setCourseSessionNumber(course, sessionNumber)}
	  panelContent={
        <OfferingCoursePanel
          className="h-full w-full"
          isOffered={selectedOfferingCourse ? selectedCourseKeys.includes(selectedOfferingCourse.key) : false}
          isPending={selectedOfferingCourse ? pendingCourseKeys.includes(selectedOfferingCourse.key) : false}
          onOffer={() => {
            if (selectedOfferingCourse) void offerCourse(selectedOfferingCourse);
          }}
        />
      }
	  selectedCourseKey={selectedCourseKey}
    />
  );
}
