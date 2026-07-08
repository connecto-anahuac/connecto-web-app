import StudentCard from "@/features/students/components/StudentCard";
import Link from "next/link";
import type { ReactNode } from "react";
import type { StudentListItem } from "@/features/students/types/student-list-item";
import SearchTool from "@/features/search/components/SearchTool";
import FilterPresetBadge from "@/components/FilterPresetBadge";
import { FilterIcon } from "@/features/home/components/server/icons";
import MultiSelect from "@/components/MultiSelect";

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
    return (
      <main className="min-h-screen bg-white p-4 text-connecto-ink">
        Loading...
      </main>
    );
  }

  return (
    <div className="flex   h-full w-full max-h-full min-h-0 gap-5 p-2.5">
      <div className="flex h-full min-h-0 w-80 shrink-0 flex-col gap-2 overflow-y-auto rounded-lg border border-divider bg-header p-2.5">
        <SearchTool />
        <div className="flex items-center justify-between gap-1.5">
          <FilterIcon /* className="h-6 w-6 shrink-0 text-Outline" */ />
          <FilterPresetBadge value="TIND" isSelected={true} />
          <FilterPresetBadge value="activo" isSelected={true} />
          <FilterPresetBadge value="alerta" isSelected={false} />
          <FilterPresetBadge value="advertencia" isSelected={false} />
        </div>
        <MultiSelect label={"Industrial"} checked={false}/>
        <MultiSelect label={"Industrial"} checked={true}/>
        <MultiSelect label={"Industrial"} isHovered={true} checked={false}/>
        <div className="flex flex-1 min-h-0 w-full shrink-0 flex-col gap-2 overflow-y-auto scrollbar-none">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/students/${student.id}`}
              className="h-fit w-full"
            >
              <StudentCard
                className={
                  `w-full ${activeStudentId === student.id
                    ? "border-[#d48744] bg-[#efe0d2]"
                    : undefined}`
                }
                student={student}
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="h-full min-w-0 flex-1">{children}</div>
    </div>
  );
}
