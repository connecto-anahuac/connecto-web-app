import type { StudentClassItem } from "@/features/student/types";
import type { StudentDetail } from "../../ui/studentSummaryPanel/studentSummary.type";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import DataSection from "@/shared/component/composite/datasection/DataSection";
import { StudentDiagram } from "./StudentDiagram";
import type { FilterPreset } from "@/shared/service/dataPipeline/filterPreset.type";
import type { Table } from "@tanstack/react-table";
import type {
  DataViewConfig,
  DataViewMetadata,
} from "@/shared/component/composite/table/dataView.types";
import { DataTable } from "@/shared/component/composite/table/DataTable";
import { FilterResult } from "@/shared/service/dataPipeline/filterDefinition";

type Props = {
  loading: boolean;
  studentGrades: readonly StudentClassItem[];
  studentDetail: StudentDetail | null;
  table: Table<StudentClassItem>;
  tableConfig: DataViewConfig<StudentClassItem>;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  presets: readonly FilterPreset[];
  // isFilterOpen: boolean;
  // onFilterToggle: () => void;
  filterResult: FilterResult; 
  metadata: DataViewMetadata;
};

export function StudentDetailPresenter({
  loading,
  studentGrades,
  studentDetail,
  table,
  tableConfig,
  searchText,
  onSearchTextChange,
  presets,
  // isFilterOpen,
  // onFilterToggle,
  filterResult,
  metadata,
}: Props) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!studentDetail) {
    return <div>Student not found</div>;
  }

  return (
    <div className="flex flex-col gap-3 pb-0 w-full h-full">
      <ContentTitleSection title={"Alumnos"} />
      <DataSection
        className="w-full flex-1 min-h-0"
        presets={presets}
        searchText={searchText}
        onSearchTextChange={onSearchTextChange}
        table={table}
        tableConfig={tableConfig}
        metadata={metadata}
        listDiagram={<DataTable config={tableConfig} table={table} />}
        cardDiagram={
          <StudentDiagram loading={loading} items={studentGrades} filterResult={filterResult} />
          // <div>DIAGRAM</div>
        }
      />
    </div>
  );
}
