import type { StudentDto } from "@/external/dto/student/student.dto";
import { StudentStatus } from "@/shared/types/consts";

export type StudentProfile = {
  id: string;
  name: string;
  status: StudentStatus;
  enrolledPeriod: string;
  enrolledYear: number;
  enrolledSemester: "ene-mayo" | "verano" | "ago-dec" | "semester";
  currentSemester: number;
  regularSemestersCount: number;
  summerSemestersCount: number;
  career: string;
  avatarColorRef: number;
};

export function toStudentProfileUI(student: StudentDto): StudentProfile {
  const enrolledSemesterCode = student.enrolledPeriod.semester.getCode();

  return {
    id: student.id,
    career: student.career,
    name: student.name,
    status: toStudentStatus(student.status),
    enrolledPeriod: student.enrolledPeriod.year + student.enrolledPeriod.semester.getCode().toString(),
    enrolledYear: student.enrolledPeriod.year,
    enrolledSemester:
      enrolledSemesterCode === 10 || enrolledSemesterCode === 15
        ? "ene-mayo"
        : enrolledSemesterCode === 40 || enrolledSemesterCode === 50
          ? "verano"
          : enrolledSemesterCode === 60 || enrolledSemesterCode === 65
            ? "ago-dec"
            : "semester",
    currentSemester: student.currentSemester,
    regularSemestersCount: student.semesterCount.regular,
    summerSemestersCount: student.semesterCount.summer,
    avatarColorRef: student.avatarColorRef,
  };
}

export function toStudentStatus(status: string): StudentStatus {
  const normalized = status
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  switch (normalized) {
    case StudentStatus.ACTIVE:
      return StudentStatus.ACTIVE;
    case StudentStatus.INACTIVE:
      return StudentStatus.INACTIVE;
    case StudentStatus.BAJA_ACADEMICA:
      return StudentStatus.BAJA_ACADEMICA;
    case StudentStatus.BAJA_VOLUNTARIA:
      return StudentStatus.BAJA_VOLUNTARIA;
    default:
      return StudentStatus.INACTIVE;
  }
}
