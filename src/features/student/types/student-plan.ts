import type { StudentPlanItemDto } from "@/external/dto/student/student.dto";

export type StudentClassItem = {
  id: string;
  keyCode: string;
  keyNumber: string;
  name: string;
  hours: number;
  credits: number;
  block: string;
  preRequisites: StudentClassItem[];
  period: string;
  grade: number;
  semester: number;
  position: number;
};

export function toStudentClassItemUI(studentClassItem: StudentPlanItemDto): StudentClassItem {
  return {
    id: studentClassItem.id,
    keyCode: studentClassItem.keyCode,
    keyNumber: studentClassItem.keyNumber,
    name: studentClassItem.name,
    hours: studentClassItem.hours,
    credits: studentClassItem.credits,
    block: studentClassItem.block,
    preRequisites: studentClassItem.preRequisites.map(toStudentClassItemUI),
    period: studentClassItem.period,
    grade: studentClassItem.grade,
    semester: studentClassItem.semester,
    position: studentClassItem.position,
  };
}