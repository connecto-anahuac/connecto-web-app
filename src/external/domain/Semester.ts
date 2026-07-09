
export class Semester {
  private constructor(
    private readonly code: SemesterCode,
  ) {}

  static create(code: number): Semester {
    if (!this.isValidCode(code)) {
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

  private static isValidCode(
    value: number,
  ): value is SemesterCode {
    return Object.values(SEMESTER_CODES).includes(
      value as SemesterCode,
    );
  }
}



export const SEMESTER_CODES = {
  SPRING: 10,
  SUMMER: 40,
  FALL: 60,
} as const;

export type SemesterCode =
  (typeof SEMESTER_CODES)[keyof typeof SEMESTER_CODES];

const LABELS: Record<SemesterCode, string> = {
  10: "Ene-Mayo",
  40: "Verano",
  60: "Ago-Dic",
};
