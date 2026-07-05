"use client";

import { ScheduleBuilderPresenter } from "./ScheduleBuilderPresenter";
import { useScheduleBuilder } from "./useScheduleBuilder";

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

  return (
    <ScheduleBuilderPresenter
      career={career}
      error={error}
      loading={loading}
      offeringCourses={offeringCourses}
      pendingCourseKeys={pendingCourseKeys}
      selectedCourseKeys={selectedCourseKeys}
      onToggle={toggleOfferingCourse}
    />
  );
}