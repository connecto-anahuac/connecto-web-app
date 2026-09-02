"use client";

import { DataSearchScopeProvider } from "@/shared/store/filter/FilterProvider";
import StudentGeneralPage, {
  bildProfileInformationa,
  buildStudentDetailInformationCards,
} from "./StudentSinglePageTemplate";
import { useStaticStudentDetail } from "./useStaticStudentDetail";

type Props = {
  studentId: string;
};

export function StudentDetailContainer({ studentId }: Props) {
  return (
    <DataSearchScopeProvider scopeId={`student:grades:${studentId}`}>
      <StudentDetailContent studentId={studentId} />
    </DataSearchScopeProvider>
  );
}

function StudentDetailContent({ studentId }: Props) {
  const { loading, studentDetail, studentGrades, totalSemesters } =
    useStaticStudentDetail(studentId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!studentDetail) {
    return <div>Student not found</div>;
  }

  return (
    <StudentGeneralPage
      infomations={bildProfileInformationa(studentDetail)}
      imgSrc={studentDetail.imgSrc ?? "/data/avator.png"}
      status={studentDetail.profile.status}
      planTotalSemesters={totalSemesters}
      {...buildStudentDetailInformationCards(
        studentDetail,
        studentGrades,
        totalSemesters,
      )}
      studentId={studentId}
    />
  );
}
