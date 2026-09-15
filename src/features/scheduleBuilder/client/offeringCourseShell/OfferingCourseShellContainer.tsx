"use client";

import { DataSearchScopeProvider } from "@/shared/store/filter/FilterProvider";
import { OfferingCourseShellPresenter } from "./OfferingCourseShellPresenter";
import { useOfferingCourses } from "./useOfferingCourses";
import { useOfferingCourseShellTable } from "./useOfferingCourseShellTable";

type Props = {
  className?: string;
  period: string;
  career: string;
};

export default function OfferingCourseShellContainer({
  className,
  period,
  career,
}: Props) {
  return (
    <DataSearchScopeProvider
      scopeId={`schedule-builder:offering-courses:${career}:${period}`}
    >
      <OfferingCourseShellContent career={career} className={className} />
    </DataSearchScopeProvider>
  );
}

type ContentProps = Pick<Props, "career" | "className">;

function OfferingCourseShellContent({ career, className }: ContentProps) {
  const { error, loading, offeringCourses } = useOfferingCourses(career);
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
    />
  );
}
