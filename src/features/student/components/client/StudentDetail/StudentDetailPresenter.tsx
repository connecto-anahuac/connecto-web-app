import type { StudentClassItem } from "@/features/student/types";
import type { StudentDetail } from "../../ui/studentSummaryPanel/studentSummary.type";
import ContentTitleSection from "@/components/ContentTitleSection";
import DataSection from "@/components/datasection/DataSection";
import { StudentDiagram } from "./StudentDiagram";
import type { FilterPreset } from "@/features/search/shared/filterPreset.type";
import type { Table } from "@tanstack/react-table";
import type { DataViewConfig } from "@/components/table/dataView.types";
import { DataTable } from "@/components/table/DataTable";

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
        listDiagram={<DataTable config={tableConfig} table={table} />}
        cardDiagram={
          <StudentDiagram loading={loading} items={studentGrades} />
          // <div>DIAGRAM</div>
        }
      />
    </div>
  );
}
