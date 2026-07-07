import StudentCardView from "@/features/students/components/StudentCardView";
import Link from "next/link";
import type { ReactNode } from "react";
import type { StudentListItem } from "@/features/students/types/student-list-item";

type Props = {
  activeStudentId: string | null;
  children: ReactNode;
  loading: boolean;
  students: StudentListItem[];
};

export function StudentsShellPresenter({
  activeStudentId,
  children,
  loading,
  students,
}: Props) {
  if (loading) {
    return <main className="min-h-screen bg-white p-4 text-connecto-ink">Loading...</main>;
  }

  return (
    <div className="flex h-full w-full max-h-full min-h-0 gap-5 p-2.5">
      <div className="flex h-full min-h-0 w-80 shrink-0 flex-col gap-2 overflow-y-auto rounded-lg border border-divider bg-header p-2.5">
        {students.map((student) => (
          <Link
            key={student.id}
            href={`/students/${student.id}`}
            className="h-fit w-full"
          >
            <StudentCardView
              className={`w-full ${activeStudentId === student.id ? "bg-orange-100" : ""}`}
              student={{
                img: "",
                name: student.name,
                status: student.status,
                career: student.career,
                plan: student.plan,
                id: student.id,
                semester: student.semester,
                advance: 0,
                requirements: 0,
                contact: {
                  schoolEmail: "",
                  privateEmail: "",
                  phone: "",
                },
                memo: "",
                avatarColorCssVar: student.avatarColorCssVar,
              }}
            />
          </Link>
        ))}
      </div>

      <div className="h-full min-w-0 flex-1">{children}</div>
    </div>
  );
}