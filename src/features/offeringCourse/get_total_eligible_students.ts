import { OfferingCourse } from "./entity";

export function getTotalEligibleStudents(offeringCourse: OfferingCourse): number {
  return Object.entries(offeringCourse.possibleStudentIds).reduce(
    (sum, [semesterKey, studentIds]) =>
      Number(semesterKey) >= offeringCourse.semester ? sum + studentIds.length : sum,
    0,
  );
}