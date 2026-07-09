import type { OfferingCourse } from "@/external/domain/offering-course";
import type { OfferingCourseRecord } from "@/external/domain/university";

export type OfferingCourseDto = {
  key: string;
  keyCode: string;
  keyNumber: string;
  hours: number;
  credits: number;
  block: string;
  name: string;
  semester: number;
  position: number;
  preRequisites: string[];
  possibleStudentIds: Record<number, string[]>;
};

export type SelectedOfferingCourseDto = {
  id: string;
  period: string;
  career: string;
  courseKey: string;
  sessionNumber: number;
  estimatedNumber: number;
};

export type UpdateOfferingCourseSelectionInput = {
  career: string;
  estimatedNumber: number;
  isSelected: boolean;
  offeringCourse: OfferingCourseDto;
};

export function toOfferingCourseDto(offeringCourse: OfferingCourse): OfferingCourseDto {
  return {
    key: offeringCourse.key,
    keyCode: offeringCourse.keyCode,
    keyNumber: offeringCourse.keyNumber,
    hours: offeringCourse.hours,
    credits: offeringCourse.credits,
    block: offeringCourse.block,
    name: offeringCourse.name,
    semester: offeringCourse.semester,
    position: offeringCourse.position,
    preRequisites: [...offeringCourse.preRequisites],
    possibleStudentIds: Object.fromEntries(
      Object.entries(offeringCourse.possibleStudentIds).map(([semester, studentIds]) => [
        Number(semester),
        [...studentIds],
      ]),
    ) as Record<number, string[]>,
  };
}

export function toSelectedOfferingCourseDto(
  offeringCourse: OfferingCourseRecord,
): SelectedOfferingCourseDto {
  return {
    id: offeringCourse.id,
    period: offeringCourse.period,
    career: offeringCourse.career,
    courseKey: offeringCourse.courseKey,
    sessionNumber: offeringCourse.sessionNumber,
    estimatedNumber: offeringCourse.estimatedNumber,
  };
}