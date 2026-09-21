"use client";

import ColumnTitle from "@/shared/component/composite/diagram/ColumnTitle";
import { Diagram } from "@/shared/component/composite/diagram/Diagram";
import {
  getDiagramCardPresentation,
  getVisiblePrerequisiteEdges,
  prerequisiteDiagramCardAttribute,
  useClearDiagramSelectionOnOutsidePointer,
} from "@/shared/component/composite/diagram/prerequisiteDiagram";
import RowTitle from "@/shared/component/composite/diagram/RowTitle";
import { usePrerequisiteLines } from "@/shared/component/composite/diagram/usePrerequisiteLines";
import type { StudyPlanCourseDto } from "@/external/dto/study-plan/study-plan.dto";
import type { FilterResult } from "@/shared/service/dataPipeline/filterDefinition";
import { cn } from "@/shared/lib/util";
import { getOrdinalNumberPrefix } from "@/shared/lib/tool";
import { useMemo } from "react";
import PlanClassCardView from "./ClassCardView";
import { usePlanDiagramSelection } from "./usePlanDiagramSelection";

export function PlanCourseDiagram({
  courses,
  filterResult,
}: {
  courses: readonly StudyPlanCourseDto[];
  filterResult: FilterResult;
}) {
  const maxSemester = Math.max(1, ...courses.map((item) => item.semester));
  const maxPosition = Math.max(1, ...courses.map((item) => item.position + 1));
  const showLocators = courses.some(
    (course) => filterResult.matches.get(course.id)?.matched !== true,
  );
  const visibleCourseIds = useMemo(
    () => new Set(courses.map((course) => course.id)),
    [courses],
  );
  const { selectedId, toggleSelection, clearSelection, highlightedIds, edges } =
    usePlanDiagramSelection(courses);
  const visibleEdges = useMemo(
    () => getVisiblePrerequisiteEdges(edges, visibleCourseIds),
    [edges, visibleCourseIds],
  );
  const { lines, rootRef, setCardRef } = usePrerequisiteLines(visibleEdges);
  useClearDiagramSelectionOnOutsidePointer(selectedId, rootRef, clearSelection);

  return (
    <Diagram.Viewport
      className="h-full w-full"
      showLocators={showLocators}
    >
      <Diagram ref={rootRef} className="relative isolate w-fit">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible text-slate-500"
        >
          {lines.map((line) => (
            <path
              key={`${line.prerequisiteId}:${line.courseId}`}
              className="fill-none stroke-current"
              d={line.path}
              data-prerequisite-edge={`${line.prerequisiteId}:${line.courseId}`}
              strokeLinecap="round"
              strokeWidth="2"
            />
          ))}
        </svg>
        <Diagram.Rows>
          {Array.from({ length: maxPosition }, (_, index) => (
            <RowTitle key={index} text={String.fromCharCode(65 + index)} />
          ))}
        </Diagram.Rows>
        <Diagram.Columns>
          {Array.from({ length: maxSemester }, (_, index) => (
            <ColumnTitle
              key={index}
              text={`${index + 1 + getOrdinalNumberPrefix(index + 1)} Semestre`}
            />
          ))}
        </Diagram.Columns>
        {courses.map((course) => {
          const matchesFilter =
            filterResult.matches.get(course.id)?.matched === true;
          const isHighlighted = highlightedIds.has(course.id);
          const presentation = getDiagramCardPresentation(
            selectedId,
            highlightedIds,
            course.id,
            matchesFilter,
          );

          return (
            <Diagram.Content
              key={course.id}
              locatorTarget={matchesFilter}
              x={course.semester}
              y={course.position + 1}
              className={cn(
                "relative z-10 transition-opacity",
                presentation.dimmed && "opacity-20",
                presentation.filterHidden && "opacity-10",
              )}
              data-course-id={course.id}
              data-highlighted={selectedId ? isHighlighted : undefined}
            >
              <button
                ref={setCardRef(course.id)}
                type="button"
                aria-label={`${course.name}の前提科目を表示`}
                aria-pressed={selectedId === course.id}
                className="block w-full rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default"
                {...{ [prerequisiteDiagramCardAttribute]: "true" }}
                disabled={!presentation.interactive}
                onClick={() => toggleSelection(course.id)}
              >
                <PlanClassCardView
                  className="w-full hover:shadow-md"
                  title={course.name}
                  courseCode={course.keyCode}
                  courseNumber={course.keyNumber}
                  credits={course.credits.toString()}
                  hours={course.hours.toString()}
                />
              </button>
            </Diagram.Content>
          );
        })}
      </Diagram>
    </Diagram.Viewport>
  );
}
