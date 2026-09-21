import type {
  DataViewConfig,
  DataViewMetadata,
} from "@/shared/types/dataView.types";
import type { Table } from "@tanstack/react-table";
import type { StudentCollectionItem } from "./studentCollection.type";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import DataSection from "@/shared/component/composite/datasection/DataSection";
import type { FilterPreset } from "@/shared/service/dataPipeline/filterPreset.type";

export type StudentCollectionPresenterProps = {
  activeStudentId?: string;
  table: Table<StudentCollectionItem>;
  tableConfig: DataViewConfig<StudentCollectionItem>;
  loading: boolean;
  errorMessage?: string;
  onStudentSelect: (studentId: string) => void;
  onStudentOpen: (studentId: string) => void;

  searchText?: string;
  onSearchTextChange?: (value: string) => void;
  presets?: readonly FilterPreset[];
  metadata?: DataViewMetadata;

  //   studentGrades: readonly StudentClassItem[];
  //   searchText: string;
  //   onSearchTextChange: (value: string) => void;
  //   presets: readonly FilterPreset[];
  //   filterResult: FilterResult;
  //   metadata: DataViewMetadata;
  //   profileInformations: Informations;
  //   imgSrc: string;
  //   status: StudentStatus;
  //   planTotalSemesters: number;
  //   topLeftInformations: ProfileDataCardProps[];
  //   warningInformations: ProfileDataCardProps;
  //   requirementInformations: ProfileDataCardProps;
  //   failedClassInformations: ProfileDataCardProps;
  //   selectedTab: StudentDetailTab;
  //   onTabChange: (value: string) => void;
};

export function StudentCollectionPresenter({
  activeStudentId,
  errorMessage,
  loading,
  onStudentOpen,
  onStudentSelect,
  table,
  tableConfig,
  searchText,
  onSearchTextChange,
  presets,
  metadata,
}: StudentCollectionPresenterProps) {
  if (errorMessage) {
    return (
      <div className="w-full h-full" role="alert">
        {errorMessage}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full" role="status">
        Cargando estudiantes...
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <ContentTitleSection title={"Alumnos"} />
      <DataSection
        className={"w-full flex-1"}
        enableView={["list"]}
        presets={presets}
        getRowId={(student) => student.studentId}
        onRowOpen={onStudentOpen}
        onRowSelect={onStudentSelect}
        selectedRowId={activeStudentId}
        searchText={searchText}
        onSearchTextChange={onSearchTextChange}
        table={table}
        tableConfig={tableConfig}
        metadata={metadata}
      />
    </div>
  );
}
