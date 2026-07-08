import ColumnTitle from "@/components/ColumnTitle";
import RowTitle from "@/components/RowTitle";
import StudentClassCardView from "@/features/student/components/ClassCardView";
import type { StudentClassItem, StudentProfile } from "@/features/student/types";
import { StudentSummaryPanel } from "./StudentSummaryPanel";
import type { StudentSummary } from "./student-summary.types";

type Props = {
  loading: boolean;
  plan: StudentClassItem[];
  student: StudentProfile | null;
  summary: StudentSummary | null;
};

export function StudentPlanPresenter({ loading, plan, student, summary }: Props) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student || !summary) {
    return <div>Student not found</div>;
  }

  const semesters = Array.from(new Set(plan.map((item) => item.semester).filter(Boolean))).sort(
    (left, right) => left - right,
  );
  const maxSemester = semesters.length ? Math.max(...semesters) : 1;
  const maxPosition = plan.length ? Math.max(...plan.map((item) => item.position)) + 1 : 1;

  return (
    <div className="flex min-h-full h-full w-full gap-4 p-0">
      <div className="min-w-0 flex-1 overflow-auto">
        <div
          className="w-fit"
          style={{
            display: "grid",
            gridTemplateColumns: `auto repeat(${maxSemester}, minmax(13rem, 1fr))`,
            gridAutoRows: "min-content",
            gap: "1rem",
          }}
        >
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

          {plan.map((item) => (
            <div
              key={item.id}
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
              />
            </div>
          ))}
        </div>
      </div>

      <StudentSummaryPanel summary={summary} className="sticky top-4 self-start" />
    </div>
  );
}