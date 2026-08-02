import StudentCard from "@/features/student/components/client/StudentCard";
import Link from "next/link";
import type { ReactNode } from "react";
import type { StudentListItem } from "@/features/student/types/student-list-item";
import SearchBar from "@/shared/component/composite/searchtool/SearchTool";
import type {
  DataViewConfig,
  DataViewMetadata,
} from "@/shared/component/composite/table/dataView.types";
import FilterPresetBadge from "@/shared/component/primitive/FilterPresetBadge";
import { FilterIcon } from "@/features/home/components/server/icons";
import SearchTool from "@/shared/component/composite/searchtool/search-tool/SearchTool";

type Props = {
  activeStudentId: string | null;
  children: ReactNode;
  loading: boolean;
  students: StudentListItem[];
  config: DataViewConfig<StudentListItem>;
  metadata: DataViewMetadata;
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
  config,
  metadata,
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
    <div className="  w-full   flex   h-full max-h-full min-h-0 gap-5 p-2.5 overflow-x-visible">
     {/* w-80 */} <div className="overflow-x-auto  w-12 flex z-50 h-full min-h-0 shrink-0 flex-col gap-2  rounded-lg border border-divider bg-header p-2.5">
        <div className="flex items-center gap-3 ">
          
          <SearchBar
              value={searchText}
              onChange={(event) => onSearchTextChange(event.target.value)}
              onFilterClick={onFilterToggle}
          />
          <SearchTool
            config={config}
            metadata={metadata}
            onClick={onFilterToggle}
            isSelected={isFilterOpen}
          />
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
