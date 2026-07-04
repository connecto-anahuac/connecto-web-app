export const OFFERING_SELECTION_PERIOD = "202660";

export function createOfferingMaterialSelectionId(career: string, materiaKey: string): string {
  return `${career}:${OFFERING_SELECTION_PERIOD}:${materiaKey}`;
}