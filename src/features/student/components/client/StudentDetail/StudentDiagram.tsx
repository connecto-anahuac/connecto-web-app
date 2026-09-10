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
};

export function StudentDiagram({
  loading = false,
  items,
  className,
  filterResult,
  ...props
}: Props) {
  if (loading) {
    return <div>Loading...</div>;
  }

  const allGrades = items;

  const semesters = Array.from(
    new Set(allGrades.map((item) => item.semester).filter(Boolean)),
  ).sort((left, right) => left - right);
  const maxSemester = semesters.length ? Math.max(...semesters) : 1;
  const maxPosition = allGrades.length
    ? Math.max(...allGrades.map((item) => item.position)) + 1
    : 1;

  return (
    <div
      className={cn("h-full w-full   overflow-auto relative", className)}
      {...props}
    >
      <Diagram className="w-fit">
        <Diagram.Rows>
          {Array.from({ length: maxPosition }, (_, index) => {
            const position = index + 1;
            return (
              <RowTitle
                key={`position-${position}`}
                text={String.fromCharCode(64 + position)}
              />
            );
          })}
        </Diagram.Rows>

        <Diagram.Columns>
          {Array.from({ length: maxSemester }, (_, index) => {
            const semester = index + 1;
            return (
              <ColumnTitle
                key={`semester-${semester}`}
                text={`Semestre ${semester}`}
              />
            );
          })}
        </Diagram.Columns>

        {items.map((item) => (
          <Diagram.Content
            key={item.id}
            className={cn(
              "transition",
              !filterResult.matches.get(item.id)?.matched &&
                "pointer-events-none opacity-10",
            )}
            x={item.semester}
            y={item.position + 1}
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
        ))}
      </Diagram>
    </div>
  );
}
