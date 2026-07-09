import type { StudentDto } from "@/external/dto/student/student.dto";

export type StudentProfile = {
  id: string;
  name: string;
  status: string;
  enrolledPeriod: string;
  currentSemester: number;
  regularSemestersCount: number;
  avatarColorRef: number;
};

export function toStudentProfileUI(student: StudentDto): StudentProfile {
  return {
    id: student.id,
    name: student.name,
    status: student.status,
    enrolledPeriod: student.enrolledPeriod.year + student.enrolledPeriod.semester.getCode().toString(),
    currentSemester: student.currentSemester,
    regularSemestersCount: student.semesterCount.regular,
    avatarColorRef: student.avatarColorRef,
  };
}