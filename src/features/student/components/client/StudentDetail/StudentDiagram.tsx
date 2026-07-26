import ColumnTitle from "@/components/ColumnTitle";
import RowTitle from "@/components/RowTitle";
import StudentClassCardView from "@/features/student/components/ui/ClassCardView";
import type { StudentClassItem } from "@/features/student/types";
import type { FilterableItem } from "@/features/search/shared/filterDefinition";
import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  loading: boolean;
  filterableItems: FilterableItem<StudentClassItem>[];
};

export function StudentDiagram({
  loading,
  filterableItems,
  className,
  ...props
}: Props) {
  if (loading) {
    return <div>Loading...</div>;
  }

  const allGrades = filterableItems.map(
    (filterableItem) => filterableItem.item,
  );

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
      <div
        className="w-fit"
        style={{
          display: "grid",
          gridTemplateColumns: `auto repeat(${maxSemester}, minmax(13rem, 1fr))`,
          gridAutoRows: "min-content",
          gap: "1rem",
        }}
      >
        {/* top-left-edge */}
        <div
          key="table-edge"
          className="w-fit"
          style={{
            gridColumnStart: 1,
            gridRowStart: 1,
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 30,
            background: "transparent",
          }}
        >
          <div className="w-4" />
        </div>

        {/* RowTitle A,B,C,D,... */}
        {Array.from({ length: maxPosition }, (_, index) => {
          const position = index + 1;
          return (
            <div
              key={`position-${position}`}
              style={{
                gridColumnStart: 1,
                gridRowStart: position + 1,
                position: "sticky",
                left: 0,
                zIndex: 20,
              }}
            >
              <RowTitle text={String.fromCharCode(64 + position)} />
            </div>
          );
        })}

        {/* ColumnTitle Semestre 1,Semestre 2,... */}
        {Array.from({ length: maxSemester }, (_, index) => {
          const semester = index + 1;
          return (
            <div
              key={`semester-${semester}`}
              style={{
                gridColumnStart: semester + 1,
                gridRowStart: 1,
                position: "sticky",
                top: 0,
                zIndex: 25,
              }}
            >
              <ColumnTitle text={`Semestre ${semester}`} />
            </div>
          );
        })}

        {/* data */}
        {filterableItems.map(({ item, isMatch }) => (
          <div
            key={item.id}
            className={
              !isMatch ? "grayscale opacity-45 transition" : "transition"
            }
            style={{
              gridColumnStart: item.semester + 1 || 2,
              gridRowStart: item.position + 2 || 2,
            }}
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
          </div>
        ))}
      </div>
    </div>
  );
}
