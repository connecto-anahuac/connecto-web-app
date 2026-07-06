export type OfferingCourse = {
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

export const passGrade = 6;

export const OFFERING_SELECTION_PERIOD = "202660";

export function createOfferingCourseselectionId(career: string, courseKey: string): string {
  return `${career}:${OFFERING_SELECTION_PERIOD}:${courseKey}`;
}