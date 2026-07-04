import { OfferingMaterial } from "./entity";

export function getTotalEligibleStudents(offeringMaterial: OfferingMaterial): number {
  return Object.entries(offeringMaterial.possibleStudentIds).reduce(
    (sum, [semesterKey, studentIds]) =>
      Number(semesterKey) >= offeringMaterial.semester ? sum + studentIds.length : sum,
    0,
  );
}