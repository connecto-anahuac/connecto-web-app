import ColumnTitle from "@/shared/component/composite/diagram/ColumnTitle";
import { Diagram } from "@/shared/component/composite/diagram/Diagram";
import RowTitle from "@/shared/component/composite/diagram/RowTitle";
import { FilterResult } from "@/shared/service/dataPipeline/filterDefinition";
import StudentClassCardView from "@/features/student/components/ui/ClassCardView";
import type { StudentClassItem } from "@/features/student/types";
import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

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
  if (loading) {
    return <div>Loading...</div>;
  }

  const axes = getStudentDiagramAxes(items);
  const semesters = axes.semesters.filter(
    (semester) => !hiddenItemIds.has(studentSemesterHideId(semester)),
  );
  const positions = axes.positions.filter(
    (position) => !hiddenItemIds.has(studentPositionHideId(position)),
  );

  return (
    <div
      className={cn("h-full w-full   overflow-auto relative", className)}
      {...props}
    >
      <Diagram className="w-fit">
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

          return (
            <Diagram.Content
              key={item.id}
              className={cn(
                "transition",
                !filterResult.matches.get(item.id)?.matched &&
                  "pointer-events-none opacity-10",
              )}
              x={columnIndex + 1}
              y={rowIndex + 1}
            >
              <StudentClassCardView
                className="w-full"
                courseCode={item.keyCode || item.id}
                courseNumber={item.keyNumber || ""}
                title={item.name}
                period={item.period}
                grade={item.grade}
                credits={item.credits ? item.credits.toString() : undefined}
                hours={item.hours ? item.hours.toString() : undefined}
                status={item.status}
              />
            </Diagram.Content>
          );
        })}
      </Diagram>
    </div>
  );
}
