import type { StudentDto } from "@/external/dto/student/student.dto";

export type StudentProfile = {
  id: string;
  name: string;
  status: string;
  enrolledPeriod: string;
  enrolledYear: number;
  enrolledSemester: "ene-mayo" | "verano" | "ago-dec" | "semester";
  currentSemester: number;
  regularSemestersCount: number;
  avatarColorRef: number;
};

export function toStudentProfileUI(student: StudentDto): StudentProfile {
  const enrolledSemesterCode = student.enrolledPeriod.semester.getCode();

  return {
    id: student.id,
    name: student.name,
    status: student.status,
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
    avatarColorRef: student.avatarColorRef,
  };
}