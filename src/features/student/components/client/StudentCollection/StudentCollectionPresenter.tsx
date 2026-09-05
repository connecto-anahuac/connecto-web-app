import { DataTable } from "@/shared/component/composite/table/DataTable";
import { DataViewConfig } from "@/shared/types/dataView.types";
import { Table } from "@tanstack/react-table";
import { StudentCollectionItem } from "./studentCollection.type";

export type StudentCollectionPresenterProps = {
  table: Table<StudentCollectionItem>;
  tableConfig: DataViewConfig<StudentCollectionItem>;
  loading: boolean;
  errorMessage?: string;

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
  errorMessage,
  loading,
  table,
  tableConfig,
}: StudentCollectionPresenterProps) {
  if (errorMessage) {
    return <div className="w-full h-full" role="alert">{errorMessage}</div>;
  }

  if (loading) {
    return <div className="w-full h-full" role="status">Cargando estudiantes...</div>;
  }

  return (
    <div className="w-full h-full">
      <DataTable config={tableConfig} table={table} />
    </div>
  );
}
