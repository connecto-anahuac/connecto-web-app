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
import { FilterResult } from "@/shared/service/dataPipeline/filterDefinition";
import StudentClassCardView from "@/features/student/components/ui/ClassCardView";
import type { StudentClassItem } from "@/features/student/types";
import { cn } from "@/shared/lib/util";
import { type ComponentProps, useMemo } from "react";

import { useStudentDiagramSelection } from "./useStudentDiagramSelection";

type Props = ComponentProps<"div"> & {
  loading?: boolean;
  items: readonly StudentClassItem[];
  filterResult: FilterResult;
  hiddenItemIds?: ReadonlySet<string>;
};

export const studentSemesterHideId = (semester: number) =>
  `semester:${semester}`;
export const studentPositionHideId = (position: number) =>
  `position:${position}`;

export function getStudentDiagramAxes(items: readonly StudentClassItem[]) {
  const maxSemester = items.length
    ? Math.max(...items.map((item) => item.semester), 1)
    : 1;
  const maxPosition = items.length
    ? Math.max(...items.map((item) => item.position)) + 1
    : 1;

  return {
    semesters: Array.from({ length: maxSemester }, (_, index) => index + 1),
    positions: Array.from({ length: maxPosition }, (_, index) => index),
  };
}

export function StudentDiagram({
  loading = false,
  items,
  className,
  filterResult,
  hiddenItemIds = new Set(),
  ...props
}: Props) {
  const axes = useMemo(() => getStudentDiagramAxes(items), [items]);
  const semesters = useMemo(
    () =>
      axes.semesters.filter(
        (semester) => !hiddenItemIds.has(studentSemesterHideId(semester)),
      ),
    [axes.semesters, hiddenItemIds],
  );
  const positions = useMemo(
    () =>
      axes.positions.filter(
        (position) => !hiddenItemIds.has(studentPositionHideId(position)),
      ),
    [axes.positions, hiddenItemIds],
  );
  const visibleItemIds = useMemo(
    () =>
      new Set(
        items
          .filter(
            (item) =>
              semesters.includes(item.semester) &&
              positions.includes(item.position),
          )
          .map((item) => item.id),
      ),
    [items, positions, semesters],
  );
  const { selectedId, toggleSelection, clearSelection, highlightedIds, edges } =
    useStudentDiagramSelection(items);
  const visibleEdges = useMemo(
    () => getVisiblePrerequisiteEdges(edges, visibleItemIds),
    [edges, visibleItemIds],
  );
  const { lines, rootRef, setCardRef } =
    usePrerequisiteLines(visibleEdges);
  useClearDiagramSelectionOnOutsidePointer(selectedId, rootRef, clearSelection);
  const showLocators = items.some(
    (item) => filterResult.matches.get(item.id)?.matched !== true,
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Diagram.Viewport
      className={cn("h-full w-full", className)}
      showLocators={showLocators}
      {...props}
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
          {positions.map((position) => {
            return (
              <RowTitle
                key={`position-${position}`}
                text={String.fromCharCode(65 + position)}
              />
            );
          })}
        </Diagram.Rows>

        <Diagram.Columns>
          {semesters.map((semester) => {
            return (
              <ColumnTitle
                key={`semester-${semester}`}
                text={`Semestre ${semester}`}
              />
            );
          })}
        </Diagram.Columns>

        {items.map((item) => {
          const columnIndex = semesters.indexOf(item.semester);
          const rowIndex = positions.indexOf(item.position);
          if (columnIndex < 0 || rowIndex < 0) return null;

          const matchesFilter =
            filterResult.matches.get(item.id)?.matched === true;
          const isHighlighted = highlightedIds.has(item.id);
          const presentation = getDiagramCardPresentation(
            selectedId,
            highlightedIds,
            item.id,
            matchesFilter,
          );

          return (
            <Diagram.Content
              key={item.id}
              locatorTarget={matchesFilter}
              className={cn(
                "relative z-10 transition-opacity",
                presentation.dimmed && "opacity-20",
                presentation.filterHidden && "opacity-10",
              )}
              data-course-id={item.id}
              data-highlighted={selectedId ? isHighlighted : undefined}
              x={columnIndex + 1}
              y={rowIndex + 1}
            >
              <button
                ref={setCardRef(item.id)}
                type="button"
                aria-label={`${item.name}の前提科目を表示`}
                aria-pressed={selectedId === item.id}
                className="block w-full rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default"
                {...{ [prerequisiteDiagramCardAttribute]: "true" }}
                data-student-diagram-card="true"
                disabled={!presentation.interactive}
                onClick={() => toggleSelection(item.id)}
              >
                <StudentClassCardView
                  className="w-full hover:shadow-md"
                  courseCode={item.keyCode || item.id}
                  courseNumber={item.keyNumber || ""}
                  title={item.name}
                  period={item.period}
                  grade={item.grade}
                  credits={item.credits ? item.credits.toString() : undefined}
                  hours={item.hours ? item.hours.toString() : undefined}
                  status={item.status}
                />
              </button>
            </Diagram.Content>
          );
        })}
      </Diagram>
    </Diagram.Viewport>
  );
}
