"use client";

import Diagram from "@/features/offeringCourse/components/Diagram";
import OfferingClassCardView from "@/features/offeringCourse/components/OfferingClassCardView";
import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import SearchBar from "@/shared/component/composite/searchtool/SearchTool";
import SearchTool from "@/shared/component/composite/searchtool/search-tool/SearchTool";
import type {
  DataViewConfig,
  DataViewMetadata,
} from "@/shared/types/dataView.types";
import type { ReactNode } from "react";
import type { OfferingCourseDraft } from "./scheduleBuilderStore";

type Props = {
  career: string;
  config: DataViewConfig<OfferingCourse>;
  metadata: DataViewMetadata;
  error: string | null;
  hasActiveFilters: boolean;
  isFilterOpen: boolean;
  loading: boolean;
  matchingCourseKeys: Set<string>;
  onFilterToggle: () => void;
  onSearchTextChange: (value: string) => void;
  offeringCourses: OfferingCourse[];
  pendingCourseKeys: string[];
  drafts: Record<string, OfferingCourseDraft>;
  searchText: string;
  selectedCourseKeys: string[];
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
  hasActiveFilters,
  isFilterOpen,
  loading,
  matchingCourseKeys,
  onFilterToggle,
  onSearchTextChange,
  offeringCourses,
  pendingCourseKeys,
  drafts,
  searchText,
  selectedCourseKeys,
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
      <div className="flex items-center gap-3 pt-3 pl-6 z-50">
        <SearchBar
          value={searchText}
          onChange={(event) => onSearchTextChange(event.target.value)}
          onFilterClick={onFilterToggle}
          placeholder="buscar por nombre de clase"
        />
        <SearchTool
          config={config}
          metadata={metadata}
          onClick={onFilterToggle}
          isSelected={isFilterOpen}
        />
      </div>
      <div className="flex gap-3 w-full flex-1 min-h-0">
        <div className="h-full w-full overflow-auto p-2.5">
          <Diagram maxSemester={maxSemester} maxPosition={maxPosition}>
            {offeringCourses.map((offeringCourse) => {
              const draft = drafts[offeringCourse.key];
              const estimatedNumber = draft
                ? getEnabledStudentTotal(draft.enabledStudentIdsByStudyPlan)
                : offeringCourse.estimatedNumber;
              return (
              <div
                key={`${offeringCourse.key}-${offeringCourse.semester}-${offeringCourse.position}`}
                className={
                  hasActiveFilters &&
                  !matchingCourseKeys.has(offeringCourse.key)
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
                  estimatedNumber={estimatedNumber}
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
        {sidePanel}
      </div>
    </div>
  );
}
