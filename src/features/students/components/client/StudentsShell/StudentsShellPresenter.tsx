import StudentCard from "@/features/students/components/StudentCard";
import Link from "next/link";
import type { ReactNode } from "react";
import type { StudentListItem } from "@/features/students/types/student-list-item";
import SearchBar from "@/features/search/components/SearchTool";
import type { FilterDefinition } from "@/features/search/shared/filterDefinition";
import FilterPresetBadge from "@/components/FilterPresetBadge";
import { FilterIcon } from "@/features/home/components/server/icons";
import SearchTool from "@/features/search/components/search-tool/SearchTool";

type Props = {
  activeStudentId: string | null;
  children: ReactNode;
  loading: boolean;
  students: StudentListItem[];
  definitions: readonly FilterDefinition<StudentListItem>[];
  searchText: string;
  onSearchTextChange: (value: string) => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  presetState: {
    career: boolean;
    status: boolean;
    alerta: boolean;
    advertencia: boolean;
  };
  onPresetToggle: (presetKey: "career" | "status" | "alerta" | "advertencia") => void;
};

export function StudentsShellPresenter({
  activeStudentId,
  children,
  loading,
  students,
  definitions,
  searchText,
  onSearchTextChange,
  isFilterOpen,
  onFilterToggle,
  presetState,
  onPresetToggle,
}: Props) {
  if (loading) {
    return (
      <main className="min-h-screen bg-white p-4 text-connecto-ink">
        Loading...
      </main>
    );
  }

  return (
    <div className="flex   h-full w-full max-h-full min-h-0 gap-5 p-2.5 overflow-x-visible">
      <div className="flex z-50 h-full min-h-0 w-80 shrink-0 flex-col gap-2  rounded-lg border border-divider bg-header p-2.5">
        <div className="flex items-center gap-3">
          
          <SearchBar
              value={searchText}
              onChange={(event) => onSearchTextChange(event.target.value)}
              onFilterClick={onFilterToggle}
          />
          <SearchTool definitions={definitions} onClick={onFilterToggle} isSelected={isFilterOpen} />
        </div>

        
        <div className="flex items-center justify-between gap-1.5">
          <FilterIcon /* className="h-6 w-6 shrink-0 text-Outline" */ />
          <FilterPresetBadge value="TIND" isSelected={presetState.career} onClick={() => onPresetToggle("career")} />
          <FilterPresetBadge value="Activo" isSelected={presetState.status} onClick={() => onPresetToggle("status")} />
          <FilterPresetBadge value="alerta" isSelected={presetState.alerta} onClick={() => onPresetToggle("alerta")} />
          <FilterPresetBadge value="advertencia" isSelected={presetState.advertencia} onClick={() => onPresetToggle("advertencia")} />
        </div>
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
