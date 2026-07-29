import type {
  StudentClassItem,
} from "@/features/student/types";
import type { FilterDefinition, FilterableItem } from "@/features/search/shared/filterDefinition";
import type { StudentDetail } from "../../ui/studentSummaryPanel/studentSummary.type";
import ContentTitleSection from "@/components/ContentTitleSection";
import DataSection from "@/components/datasection/DataSection";
import { StudentDiagram } from "./StudentDiagram";
import type { FilterPreset } from "@/features/search/shared/filterPreset.type";

type Props = {
  loading: boolean;
  filterableItems: readonly FilterableItem<StudentClassItem>[];
  studentDetail: StudentDetail | null;
  definitions: readonly FilterDefinition<StudentClassItem>[];
  searchText: string;
  onSearchTextChange: (value: string) => void;
  presets: readonly FilterPreset[];
  // isFilterOpen: boolean;
  // onFilterToggle: () => void;
};

export function StudentDetailPresenter({
  loading,
  filterableItems,
  studentDetail,
  definitions,
  searchText,
  onSearchTextChange,
  presets,
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
   <div className="flex flex-col gap-3 pb-0 w-full h-full">
      <ContentTitleSection title={"Alumnos"} />
      <DataSection
        definitions={definitions}
        className="w-full flex-1 min-h-0"
        presets={presets}
        searchText={searchText}
        onSearchTextChange={onSearchTextChange}
        listDiagram={<div> LIST VIEW</div>}
        cardDiagram={
          <StudentDiagram
            loading={loading}
            items={filterableItems.map((filterableItem) => filterableItem.item)}
          />
        }
      />
    </div>
  );
}
