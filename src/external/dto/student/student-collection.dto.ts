import type { Period } from "@/shared/types/Period";
import type { SemesterCount } from "@/shared/types/SemesterCount";
import type { Student } from "@/external/domain/student";

/** A pre-computed row for the student collection; no per-student plan lookup is required. */
export type StudentCollectionSummaryDto = {
  id: string;
  name: string;
  status: string;
  career: string;
  enrolledPeriod: Period;
  semesterCount: SemesterCount;
  currentSemester: number;
  avatarColorRef: number;
  failCount: number;
  classProgress: number;
  failedClassCount: number;
};

export function toStudentCollectionSummaryDto(
  student: Student,
  classProgress: number,
  failedClassCount: number,
): StudentCollectionSummaryDto {
  return {
    id: student.id,
    name: student.name,
    status: student.status,
    career: student.career,
    enrolledPeriod: student.enrolledPeriod,
    semesterCount: student.semesterCount,
    currentSemester: student.currentSemester,
    avatarColorRef: student.avatarColorRef,
    failCount: student.failCount,
    classProgress,
    failedClassCount,
  };
}
