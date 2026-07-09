export class Semester {
  private constructor(private readonly code: SemesterCode) {}

  static create(code: number): Semester {
    if (code.toString().trim().length === 6) {
      code = Number(code.toString().slice(4, 6));
    }
    if (!this.isValidCode(code)) {
      console.log("=========================Semester create", code, );
      throw new Error(`Invalid semester code: ${code}`);
    }

    return new Semester(code);
  }

  getCode(): SemesterCode {
    return this.code;
  }

  get label(): string {
    return LABELS[this.code];
  }

  equals(other: Semester): boolean {
    return this.code === other.code;
  }

  private static isValidCode(value: number): value is SemesterCode {
    return Object.values(SEMESTER_CODES).includes(value as SemesterCode);
  }
}

//TODO 65????? 15????? 50??
export const SEMESTER_CODES = {
  SPRING: 10,
  SPRING_LATE: 15,
  SUMMER: 40,
  SUMMER_LATE: 50,
  FALL: 60,
  FALL_LATE: 65,
} as const;

export type SemesterCode = (typeof SEMESTER_CODES)[keyof typeof SEMESTER_CODES];

const LABELS: Record<SemesterCode, string> = {
  10: "Ene-Mayo",
  15: "15Ene-Mayo",
  40: "Verano",
  50: "50Verano",
  60: "Ago-Dic",
  65: "65Ago-Dic",
};
