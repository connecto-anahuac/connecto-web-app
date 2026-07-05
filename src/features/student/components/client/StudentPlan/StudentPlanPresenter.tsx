import ColumnTitle from "@/components/ColumnTitle";
import RowTitle from "@/components/RowTitle";
import StudentClassCardView from "@/features/student/components/ClassCardView";
import type { StudentClassItem, StudentProfile } from "@/features/student/types/types";

type Props = {
  loading: boolean;
  plan: StudentClassItem[];
  student: StudentProfile | null;
};

export function StudentPlanPresenter({ loading, plan, student }: Props) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  const semesters = Array.from(new Set(plan.map((item) => item.semester).filter(Boolean))).sort(
    (left, right) => left - right,
  );
  const maxSemester = semesters.length ? Math.max(...semesters) : 1;
  const maxPosition = plan.length ? Math.max(...plan.map((item) => item.position)) + 1 : 1;

  return (
    <div className="min-h-full h-full w-full overflow-auto p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{student.name}</h2>
        <div className="text-sm text-gray-500">{student.enrolledPeriod}</div>
      </div>

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
  );
}