"use client";

import Diagram from "@/features/offeringCourse/components/Diagram";
import OfferingClassCardView from "@/features/offeringCourse/components/OfferingClassCardView";
import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import DataSection from "@/shared/component/composite/datasection/DataSection";
import { DataTable } from "@/shared/component/composite/table/DataTable";
import type { FilterResult } from "@/shared/service/dataPipeline/filterDefinition";
import type {
  DataViewConfig,
  DataViewMetadata,
} from "@/shared/types/dataView.types";
import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";
import type { OfferingCourseDraft } from "./scheduleBuilderStore";

type Props = {
  career: string;
  config: DataViewConfig<OfferingCourse>;
  metadata: DataViewMetadata;
  error: string | null;
  filterResult: FilterResult;
  loading: boolean;
  onSearchTextChange: (value: string) => void;
  offeringCourses: OfferingCourse[];
  pendingCourseKeys: string[];
  drafts: Record<string, OfferingCourseDraft>;
  searchText: string;
  selectedCourseKeys: string[];
  table: Table<OfferingCourse>;
  onOffer: (offeringCourse: OfferingCourse) => void;
  onOpen: (offeringCourse: OfferingCourse) => void;
  onUnoffer: (offeringCourse: OfferingCourse) => void;
  onSessionCountChange: (offeringCourse: OfferingCourse, sessionNumber: number) => void;
  sidePanel: ReactNode;
};

/** A student contributes once per study plan, even if IDs overlap between plans. */
export function getEnabledStudentTotal(
  enabledStudentIdsByStudyPlan: OfferingCourseDraft["enabledStudentIdsByStudyPlan"],
): number {
  return Object.values(enabledStudentIdsByStudyPlan).reduce(
    (total, studentIds) => total + new Set(studentIds).size,
    0,
  );
}

export function ScheduleBuilderPresenter({
  career,
  config,
  metadata,
  error,
  filterResult,
  loading,
  onSearchTextChange,
  offeringCourses,
  pendingCourseKeys,
  drafts,
  searchText,
  selectedCourseKeys,
  table,
  onOffer,
  onOpen,
  onUnoffer,
  onSessionCountChange,
  sidePanel,
}: Props) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (offeringCourses.length === 0) {
    return <div>No courses found for {career}</div>;
  }

  const maxSemester = Math.max(
    ...offeringCourses.map((item) => item.semester),
    1,
  );
  const maxPosition =
    Math.max(...offeringCourses.map((item) => item.position), 1) + 1;

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="flex gap-3 w-full flex-1 min-h-0">
        <DataSection
          className="w-full h-full"
          defaultView="card"
          searchText={searchText}
          onSearchTextChange={onSearchTextChange}
          table={table}
          tableConfig={config}
          metadata={metadata}
          listDiagram={<DataTable config={config} table={table} />}
          cardDiagram={
            <div className="h-full w-full overflow-auto p-2.5">
              <Diagram maxSemester={maxSemester} maxPosition={maxPosition}>
                {offeringCourses.map((offeringCourse) => {
                  const draft = drafts[offeringCourse.key];
                  return (
              <div
                key={`${offeringCourse.key}-${offeringCourse.semester}-${offeringCourse.position}`}
                className={
                  filterResult.matches.get(offeringCourse.key)?.matched !== true
                    ? "grayscale opacity-45 transition"
                    : "transition"
                }
                style={{
                  gridColumnStart: offeringCourse.semester + 1 || 2,
                  gridRowStart: offeringCourse.position + 2 || 2,
                }}
              >
                <OfferingClassCardView
                  offeringClass={offeringCourse}
                  className="w-full"
                  estimatedNumber={offeringCourse.estimatedNumber}
                  isSelected={selectedCourseKeys.includes(offeringCourse.key)}
                  isPending={pendingCourseKeys.includes(offeringCourse.key)}
                  onOffer={() => onOffer(offeringCourse)}
                  onOpen={() => onOpen(offeringCourse)}
				  onSessionCountChange={(sessionNumber) =>
					  onSessionCountChange(offeringCourse, sessionNumber)
				  }
                  onUnoffer={() => onUnoffer(offeringCourse)}
                  sessionNumber={draft?.sessionNumber}
                />
              </div>
                  );
                })}
              </Diagram>
            </div>
          }
        />
        {sidePanel}
      </div>
    </div>
  );
}
