export type SemesterType = "ene-mayo" | "verano" | "ago-dec" | "unknown";


export const SEMESTER_INDX: Record<number, SemesterType> = {
  10: "ene-mayo",
  40: "verano",
  60: "ago-dec",
  0: "unknown",
};
