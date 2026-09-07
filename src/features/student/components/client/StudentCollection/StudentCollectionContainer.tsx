"use client";

import type { ReactNode } from "react";
import { StudentCollectionPresenter } from "./StudentCollectionPresenter";
import { useStaticStudentCollection } from "./useStaticStudentCollection";
import { useStudentCollectionTable } from "./useStudentCollectionTable";

type StudentCollectionContainerProps = {
  activeStudentId?: string;
  onStudentSelect: (studentId: string) => void;
  onStudentOpen: (studentId: string) => void;
  onStudentPreviewClose: () => void;
  renderStudentPreview: (studentId: string) => ReactNode;
};

export function StudentCollectionContainer({
  activeStudentId,
  onStudentSelect,
  onStudentOpen,
  onStudentPreviewClose,
  renderStudentPreview,
}: StudentCollectionContainerProps) {
  const { errorMessage, loading, studentCollection } = useStaticStudentCollection();
  const { config, table } = useStudentCollectionTable(studentCollection);

  return (
    <StudentCollectionPresenter
      activeStudentId={activeStudentId}
      errorMessage={errorMessage}
      loading={loading}
      onStudentOpen={onStudentOpen}
      onStudentPreviewClose={onStudentPreviewClose}
      onStudentSelect={onStudentSelect}
      renderStudentPreview={renderStudentPreview}
      table={table}
      tableConfig={config}
    />
  );
}
