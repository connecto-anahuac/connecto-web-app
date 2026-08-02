"use client";

import Diagram from "@/features/offeringCourse/components/Diagram";
import OfferingClassCardView from "@/features/offeringCourse/components/OfferingClassCardView";
import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import SearchBar from "@/shared/component/composite/searchtool/SearchTool";
import SearchTool from "@/shared/component/composite/searchtool/search-tool/SearchTool";
import type {
  DataViewConfig,
  DataViewMetadata,
} from "@/shared/component/composite/table/dataView.types";
import { useState } from "react";
import OfferingCourseDetail from "../../OfferingCourseDetail";

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
  searchText: string;
  selectedCourseKeys: string[];
  onToggle: (offeringCourse: OfferingCourse) => Promise<void>;
};

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
  searchText,
  selectedCourseKeys,
  onToggle,
}: Props) {
  const [selectedCourseKey, setSelectedCourseKey] = useState<string | null>(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (offeringCourses.length === 0) {
    return <div>No courses found for {career}</div>;
  }

  const selectedOfferingCourse =
    offeringCourses.find((offeringCourse) => offeringCourse.key === selectedCourseKey) ??
    offeringCourses[0];

  const maxSemester = Math.max(...offeringCourses.map((item) => item.semester), 1);
  const maxPosition = Math.max(...offeringCourses.map((item) => item.position), 1) + 1;

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
      <div className="flex gap-3 w-full h-full">
        <div className="h-full w-full overflow-auto p-2.5">
          <Diagram maxSemester={maxSemester} maxPosition={maxPosition}>
            {offeringCourses.map((offeringCourse) => (
              <div
                key={`${offeringCourse.key}-${offeringCourse.semester}-${offeringCourse.position}`}
                className={
                  hasActiveFilters && !matchingCourseKeys.has(offeringCourse.key)
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
                  isSelected={selectedCourseKeys.includes(offeringCourse.key)}
                  isPending={pendingCourseKeys.includes(offeringCourse.key)}
                  onClick={() => setSelectedCourseKey(offeringCourse.key)}
                  onToggle={() => void onToggle(offeringCourse)}
                />
              </div>
            ))}
          </Diagram>
        </div>

        <OfferingCourseDetail
          className="w-72 h-full"
          offeringClass={selectedOfferingCourse}
        />
      </div>
    </div>
  );
}
