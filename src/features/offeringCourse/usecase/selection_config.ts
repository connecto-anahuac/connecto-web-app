export const OFFERING_SELECTION_PERIOD = "202660";

export function createOfferingCourseselectionId(career: string, courseKey: string): string {
  return `${career}:${OFFERING_SELECTION_PERIOD}:${courseKey}`;
}