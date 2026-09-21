"use client";

import Diagram from "@/features/offeringCourse/components/Diagram";
import OfferingClassCardView from "@/features/offeringCourse/components/OfferingClassCardView";
import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import DataSection from "@/shared/component/composite/datasection/DataSection";
import SidePanel from "@/shared/component/composite/sidePanel/SidePanel";
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
  onClosePanel: () => void;
  onUnoffer: (offeringCourse: OfferingCourse) => void;
  onSessionCountChange: (offeringCourse: OfferingCourse, sessionNumber: number) => void;
  panelContent: ReactNode;
  selectedCourseKey: string | null;
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
  onClosePanel,
  onUnoffer,
  onSessionCountChange,
  panelContent,
  selectedCourseKey,
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
  const semesters = Array.from({ length: maxSemester }, (_, index) => index + 1);
  const positions = Array.from({ length: maxPosition }, (_, index) => index);
  const cardHideItems = [
    ...semesters.map((semester) => ({
      id: `semester:${semester}`,
      label: `Semestre ${semester}`,
    })),
    ...positions.map((position) => ({
      id: `position:${position}`,
      label: `Fila ${String.fromCharCode(65 + position)}`,
    })),
  ];

  return (
    <SidePanel.Root
      className="h-full w-full gap-3"
      mode="push"
      onPanelChange={(panel) => {
        if (!panel) onClosePanel();
      }}
      panel={
        selectedCourseKey
          ? { id: selectedCourseKey, type: "offering-course" }
          : null
      }
      side="right"
    >
      <SidePanel.Main className="flex h-full min-w-0 flex-1 flex-col gap-2">
        <div className="flex w-full flex-1 min-h-0 p-2">
          <DataSection
            className="w-full h-full"
            defaultView="card"
            searchText={searchText}
            onSearchTextChange={onSearchTextChange}
            table={table}
            tableConfig={config}
            metadata={metadata}
            cardHideItems={cardHideItems}
            listDiagram={<DataTable config={config} table={table} />}
            cardDiagram={(hiddenItemIds) => {
              const visibleSemesters = semesters.filter(
                (semester) => !hiddenItemIds.has(`semester:${semester}`),
              );
              const visiblePositions = positions.filter(
                (position) => !hiddenItemIds.has(`position:${position}`),
              );

              return (
                <div className="h-full w-full overflow-auto p-2.5">
                  <Diagram
                    semesters={visibleSemesters}
                    positions={visiblePositions}
                  >
                    {offeringCourses.map((offeringCourse) => {
                      const columnIndex = visibleSemesters.indexOf(
                        offeringCourse.semester,
                      );
                      const rowIndex = visiblePositions.indexOf(
                        offeringCourse.position,
                      );
                      if (columnIndex < 0 || rowIndex < 0) return null;

                      const draft = drafts[offeringCourse.key];
                      return (
                        <div
                          key={`${offeringCourse.key}-${offeringCourse.semester}-${offeringCourse.position}`}
                          className={
                            filterResult.matches.get(offeringCourse.key)
                              ?.matched !== true
                              ? "grayscale opacity-45 transition"
                              : "transition"
                          }
                          style={{
                            gridColumnStart: columnIndex + 2,
                            gridRowStart: rowIndex + 2,
                          }}
                        >
                          <OfferingClassCardView
                            offeringClass={offeringCourse}
                            className="w-full"
                            estimatedNumber={offeringCourse.estimatedNumber}
                            isActive={selectedCourseKey === offeringCourse.key}
                            isOffered={selectedCourseKeys.includes(
                              offeringCourse.key,
                            )}
                            isPending={pendingCourseKeys.includes(
                              offeringCourse.key,
                            )}
                            onOffer={() => onOffer(offeringCourse)}
                            onOpen={() => onOpen(offeringCourse)}
                            onSessionCountChange={(sessionNumber) =>
                              onSessionCountChange(
                                offeringCourse,
                                sessionNumber,
                              )
                            }
                            onUnoffer={() => onUnoffer(offeringCourse)}
                            sessionNumber={draft?.sessionNumber}
                          />
                        </div>
                      );
                    })}
                  </Diagram>
                </div>
              );
            }}
          />
        </div>
      </SidePanel.Main>
      <SidePanel.Viewport
        aria-label="Oferta de asignatura"
        className="h-full w-72"
      >
        <SidePanel.Content type="offering-course">
          {() => panelContent}
        </SidePanel.Content>
      </SidePanel.Viewport>
    </SidePanel.Root>
  );
}
