import ColumnTitle from "@/components/ColumnTitle";
import RowTitle from "@/components/RowTitle";
import StudentClassCardView from "@/features/student/components/ui/ClassCardView";
import type {
  StudentClassItem,
  StudentProfile,
} from "@/features/student/types";
import type { FilterDefinition } from "@/features/search/shared/filter-definition";
import { StudentSummaryPanel } from "../../ui/student-summary-panel/StudentSummaryPanel";
import type { StudentDetail } from "../../ui/student-summary-panel/student-summary.types";
import ZoomInIcon from "@/components/icon/ZoomInIcon";
import SearchBar from "@/features/search/components/SearchTool";
import SearchTool from "@/features/search/components/search-tool/SearchTool";

type Props = {
  loading: boolean;
  filteredGrades: StudentClassItem[];
  allGrades: StudentClassItem[];
  studentDetail: StudentDetail | null;
  definitions: FilterDefinition<StudentClassItem>[];
  searchText: string;
  onSearchTextChange: (value: string) => void;
  matchingPlanIds: Set<string>;
  hasActiveFilters: boolean;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
};

export function StudentDetailPresenter({
  loading,
  filteredGrades,
  allGrades,
  studentDetail,
  definitions,
  searchText,
  onSearchTextChange,
  matchingPlanIds,
  hasActiveFilters,
  isFilterOpen,
  onFilterToggle,
}: Props) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if ( !studentDetail) {
    return <div>Student not found</div>;
  }

  const semesters = Array.from(
    new Set(allGrades.map((item) => item.semester).filter(Boolean)),
  ).sort((left, right) => left - right);
  const maxSemester = semesters.length ? Math.max(...semesters) : 1;
  const maxPosition = allGrades.length
    ? Math.max(...allGrades.map((item) => item.position)) + 1
    : 1;

  return (
    <div className="flex min-h-full h-full w-full gap-4 p-0">

      {/* diagram section */}
      <div id="diagram"  className="min-w-0 flex-1 h-full flex flex-col gap-2 ">
        
        {/* tools */}
        <div className="flex items-center gap-3 z-30">
          <div className=" size-7 p-1 bg-gray-300/40 text-OnSurface shadow-2xl">
            <ZoomInIcon className="size-full" />
          </div>
          
          <div className="flex items-center gap-3">
            <SearchBar
              value={searchText}
              onChange={(event) => onSearchTextChange(event.target.value)}
              onFocus={onFilterToggle}
              placeholder="buscar por nombre de clase"
            />
            <SearchTool
              definitions={definitions}
              onClick={onFilterToggle}
              isSelected={isFilterOpen}
            />
          </div>
        </div>

        {/* diagram */}
        <div className="min-w-0 flex-1  overflow-auto relative">
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
            {allGrades.map((item) => (
              <div
                key={item.id}
                className={
                  hasActiveFilters && !matchingPlanIds.has(item.id)
                    ? "grayscale opacity-45 transition"
                    : "transition"
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
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <StudentSummaryPanel
        summary={studentDetail}
        className="sticky top-4 self-start"
      />
    </div>
  );
}
