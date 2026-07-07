import { Student } from "@/external/domain/student";
import type { StudentClassItem } from "@/external/domain/student-plan";
import type { StudentEntity } from "@/external/domain/university";

export type StudentDto = {
  id: string;
  name: string;
  status: string;
    enrolledPeriod: string;
  currentSemester: number;
  regularSemestersCount: number;
  summerSemestersCount: number;
  avatarColorRef: number;
};

export type StudentPlanItemDto = {
  id: string;
  keyCode: string;
  keyNumber: string;
  name: string;
  hours: number;
  credits: number;
  block: string;
  preRequisites: StudentPlanItemDto[];
  period: string;
  grade: number;
  semester: number;
  position: number;
};

export function toStudentDto(student: Student): StudentDto {
  return {
    id: student.id,
    name: student.name,
    status: student.status,
    enrolledPeriod: student.enrolledPeriod,
    currentSemester: student.currentSemester,
    regularSemestersCount: student.regularSemestersCount,
    summerSemestersCount: student.summerSemestersCount,
    avatarColorRef: student.avatarColorRef,
  };
}

export function toStudentPlanItemDto(
  studentClassItem: StudentClassItem,
): StudentPlanItemDto {
  return {
    id: studentClassItem.id,
    keyCode: studentClassItem.keyCode,
    keyNumber: studentClassItem.keyNumber,
    name: studentClassItem.name,
    hours: studentClassItem.hours,
    credits: studentClassItem.credits,
    block: studentClassItem.block,
    preRequisites: studentClassItem.preRequisites.map(toStudentPlanItemDto),
    period: studentClassItem.period,
    grade: studentClassItem.grade,
    semester: studentClassItem.semester,
    position: studentClassItem.position,
  };
}
