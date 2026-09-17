"use client";

import { DataSearchScopeProvider } from "@/shared/store/filter/FilterProvider";
import { OfferingCourseShellPresenter } from "./OfferingCourseShellPresenter";
import { useOfferingCourseShellTable } from "./useOfferingCourseShellTable";
import { useMemo, type ReactElement, type ReactNode } from "react";
import type { ScheduleClassCardProps } from "../../component/ClassCard";
import type { ScheduleBuilderCourseDto } from "../../types";
import {
  toScheduleBuilderOfferingCourse,
  type ScheduleBuilderOfferingCourse,
} from "./scheduleBuilderOfferingCourse";

const EMPTY_OFFERING_COURSES: readonly ScheduleBuilderCourseDto[] = [];

type Props = {
  className?: string;
  period: string;
  career: string;
  offeringCourses?: readonly ScheduleBuilderCourseDto[];
  loading?: boolean;
  error?: string | null;
  completedCourseKeys?: readonly string[];
  draggingCourseKey?: string | null;
  selectedCourseKey?: string | null;
  onCourseClick?: (courseKey: string) => void;
  renderCourseCard?: (
    course: ScheduleBuilderOfferingCourse,
    card: ReactElement<ScheduleClassCardProps>,
  ) => ReactNode;
};

export default function OfferingCourseShellContainer({
  className,
  period,
  career,
  offeringCourses = EMPTY_OFFERING_COURSES,
  loading = false,
  error = null,
  completedCourseKeys,
  draggingCourseKey,
  selectedCourseKey,
  onCourseClick,
  renderCourseCard,
}: Props) {
  return (
    <DataSearchScopeProvider
      scopeId={`schedule-builder:offering-courses:${career}:${period}`}
    >
      <OfferingCourseShellContent
        className={className}
        offeringCourses={offeringCourses}
        loading={loading}
        error={error}
        completedCourseKeys={completedCourseKeys}
        draggingCourseKey={draggingCourseKey}
        selectedCourseKey={selectedCourseKey}
        onCourseClick={onCourseClick}
        renderCourseCard={renderCourseCard}
      />
    </DataSearchScopeProvider>
  );
}

type ContentProps = Omit<Props, "career" | "period">;

function OfferingCourseShellContent({
  className,
  offeringCourses: sourceCourses = EMPTY_OFFERING_COURSES,
  loading = false,
  error = null,
  ...interactionProps
}: ContentProps) {
  const offeringCourses = useMemo(
    () => sourceCourses.map(toScheduleBuilderOfferingCourse),
    [sourceCourses],
  );
  const {
    config,
    globalFilter,
    metadata,
    presets,
    setGlobalFilter,
    table,
  } = useOfferingCourseShellTable(offeringCourses);

  return (
    <OfferingCourseShellPresenter
      className={className}
      config={config}
      error={error}
      globalFilter={globalFilter}
      loading={loading}
      metadata={metadata}
      onGlobalFilterChange={setGlobalFilter}
      presets={presets}
      table={table}
      {...interactionProps}
    />
  );
}
