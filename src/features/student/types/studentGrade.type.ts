import type { StudentPlanItemDto } from "@/external/dto/student/student.dto";
import {
  GRADE_NOT_FOUND_VALUE,
  PASS_GRADE,
  PERIOD_NOT_FOUND_VALUE,
} from "@/shared/types/consts";
import { Period } from "@/shared/types/Period";

export const gradeStatus = {
  ENROLLABLE: "enrollable",
  IS_TAKING: "isTaking",
  LOCKED_BY_PRE_REQUISITES: "lockedByPreRequisites",
  LOCKED_BY_OTHERS: "lockedByOthers",
  FAILED: "failed",
  PASSED: "passed",
} as const;

export type GradeStatus = (typeof gradeStatus)[keyof typeof gradeStatus];

export type StudentClassItem = {
  id: string;
  keyCode: string;
  keyNumber: string;
  name: string;
  hours: number;
  credits: number;
  block: string;
  preRequisites: StudentClassItem[];
  period: Period | null;
  grade: number | null;
  semester: number;
  position: number;

  // calculation fields
  status: GradeStatus;
  // isTaking: boolean;
  // isEnrollable: boolean;
};

export function toStudentClassItemUI(
  studentClassItem: StudentPlanItemDto,
): StudentClassItem {
  return {
    id: studentClassItem.id,
    keyCode: studentClassItem.keyCode,
    keyNumber: studentClassItem.keyNumber,
    name: studentClassItem.name,
    hours: studentClassItem.hours,
    credits: studentClassItem.credits,
    block: studentClassItem.block,
    preRequisites: studentClassItem.preRequisites.map(toStudentClassItemUI),
    period:
      studentClassItem.period !== PERIOD_NOT_FOUND_VALUE
        ? new Period(studentClassItem.period)
        : null,
    grade: studentClassItem.grade,
    semester: studentClassItem.semester,
    position: studentClassItem.position,
    status: getStatus(
      studentClassItem.grade,
      studentClassItem.period,
      studentClassItem.preRequisites,
    ),
    // isTaking: getIsTaking(studentClassItem.grade, studentClassItem.period),
    // isEnrollable: getIsEnrollable(studentClassItem.preRequisites),
  };
}

function getIsTaking(grade: number | null, period: string): boolean {
  const tperiod = period !== PERIOD_NOT_FOUND_VALUE ? new Period(period) : null;
  if (tperiod === null) return false;
  return (
    (grade === null || grade == GRADE_NOT_FOUND_VALUE) &&
    Period.current().equals(tperiod)
  );
}

function getIsEnrollable(preRequisites: StudentPlanItemDto[]): boolean {
  // function getIsEnrollableInside(preRequisites: StudentPlanItemDto[]): boolean {
  // return preRequisites.every(
  //   (preRequisite) =>
  //     preRequisite.grade !== null && preRequisite.grade >= PASS_GRADE,
  // );
  // }
  if (preRequisites.length === 0) return true;

  return preRequisites.every(
    (preRequisite) =>
      preRequisite.grade !== null &&
      preRequisite.grade >= PASS_GRADE &&
      getIsEnrollable(preRequisite.preRequisites),
  );
}

function getStatus(
  grade: number | null,
  period: string,
  preRequisites: StudentPlanItemDto[],
): GradeStatus {
  if (grade !== null && grade >= PASS_GRADE) {
    return "passed";
  }
  if (grade !== null && grade < PASS_GRADE && grade !== GRADE_NOT_FOUND_VALUE) {
    return "failed";
  }
  if (!getIsEnrollable(preRequisites)) {
    return "lockedByPreRequisites";
  }
  if (getIsTaking(grade, period)) {
    return "isTaking";
  }
  if (false) {
    return "lockedByOthers"; //TODO prerequisito以外のロック
  }
  return "enrollable";
}
