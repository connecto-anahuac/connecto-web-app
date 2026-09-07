import { DataTableWithPreview } from "@/shared/component/composite/table/DataTableWithPreview";
import { DataViewConfig } from "@/shared/types/dataView.types";
import { Table } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { StudentCollectionItem } from "./studentCollection.type";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";

export type StudentCollectionPresenterProps = {
  activeStudentId?: string;
  table: Table<StudentCollectionItem>;
  tableConfig: DataViewConfig<StudentCollectionItem>;
  loading: boolean;
  errorMessage?: string;
  onStudentSelect: (studentId: string) => void;
  onStudentOpen: (studentId: string) => void;
  onStudentPreviewClose: () => void;
  renderStudentPreview: (studentId: string) => ReactNode;

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
  onStudentPreviewClose,
  onStudentSelect,
  renderStudentPreview,
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
      <ContentTitleSection title={"Alumnos"} />
      <DataTableWithPreview
        config={tableConfig}
        closePreviewAriaLabel="Close student preview"
        getRowId={(student) => student.studentId}
        onPreviewClose={onStudentPreviewClose}
        onRowOpen={onStudentOpen}
        onRowSelect={onStudentSelect}
        openDetailAriaLabel="Open student detail page"
        previewAriaLabel="Student preview"
        renderPreview={renderStudentPreview}
        selectedRowId={activeStudentId}
        table={table}
      />
    </div>
  );
}
