"use client";

import { StudentCollectionPresenter } from "./StudentCollectionPresenter";
import { useStaticStudentCollection } from "./useStaticStudentCollection";
import { useStudentCollectionTable } from "./useStudentCollectionTable";

type StudentCollectionContainerProps = {
  activeStudentId?: string;
  onStudentSelect: (studentId: string) => void;
  onStudentOpen: (studentId: string) => void;
};

export function StudentCollectionContainer({
  activeStudentId,
  onStudentSelect,
  onStudentOpen,
}: StudentCollectionContainerProps) {
  const { errorMessage, loading, studentCollection } =
    useStaticStudentCollection();
  const {
    config,
    table,
    globalFilter,
    presets,
    setGlobalFilter,
    metadata,
  } = useStudentCollectionTable(studentCollection);

  return (
    <StudentCollectionPresenter
      activeStudentId={activeStudentId}
      errorMessage={errorMessage}
      loading={loading}
      onStudentOpen={onStudentOpen}
      onStudentSelect={onStudentSelect}
      table={table}
      tableConfig={config}
      searchText={globalFilter}
      onSearchTextChange={setGlobalFilter}
      presets={presets}
      metadata={metadata}
    />
  );
}
