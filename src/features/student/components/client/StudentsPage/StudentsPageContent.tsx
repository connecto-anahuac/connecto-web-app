"use client";

import { StudentCollectionContainer } from "../StudentCollection/StudentCollectionContainer";
import { StudentDetailContainer } from "../StudentDetail/StudentDetailContainer";
import { useStudentPreviewNavigation } from "./useStudentPreviewNavigation";

type Props = {
  studentId?: string;
};

export function StudentsPageContent({ studentId }: Props) {
  const { closeStudentPreview, openStudentDetail, selectStudent } =
    useStudentPreviewNavigation();

  return (
    <div className="relative h-full w-full">
      <StudentCollectionContainer
        activeStudentId={studentId}
        onStudentOpen={openStudentDetail}
        onStudentPreviewClose={closeStudentPreview}
        onStudentSelect={selectStudent}
        renderStudentPreview={(previewStudentId) => (
          <StudentDetailContainer
            key="student-preview"
            className="px-4"
            studentId={previewStudentId}
          />
        )}
      />
    </div>
  );
}
