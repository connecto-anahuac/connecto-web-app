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
import ContentTitleSection from "@/components/ContentTitleSection";
import DataSection from "@/components/datasection/DataSection";
import { StudentDiagram } from "./StudentDiagram";

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
  // isFilterOpen: boolean;
  // onFilterToggle: () => void;
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
  // isFilterOpen,
  // onFilterToggle,
}: Props) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if ( !studentDetail) {
    return <div>Student not found</div>;
  }



  return (
   <div className="flex flex-col gap-3 pb-5 w-full h-full">
      <ContentTitleSection title={"Alumnos"} />
      <DataSection
        definitions={definitions}
        className="w-full flex-1 min-h-0"
        listDiagram={<div> LIST VIEW</div>}
        cardDiagram={
          <StudentDiagram
            loading={loading}
            allGrades={allGrades}
            filteredGrades={filteredGrades}
            matchingPlanIds={matchingPlanIds}
            hasActiveFilters={hasActiveFilters}
          />
        }
      />
    </div>
  );
}
