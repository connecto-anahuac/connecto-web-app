import { SemesterValue } from "@/shared/component/primitive/SemesterBadge";

export class Semester {
 private constructor(private readonly code: number) {}

  static createFromPeriod(code: number): Semester {
    if (code.toString().trim().length === 6) {
      code = Number(code.toString().slice(4, 6));
    }
    if (!this.isValidCode(code)) {
      console.log("=========================Semester create", code);
      throw new Error(`Invalid semester code: ${code}`);
    }

    return new Semester(code);
  }

  getCode(): SemesterCode {
    
    if (this.code < 40) {
      return 10;
    } else if (this.code < 60) {
      return 40;
    } else if (this.code < 70) {
      return 60;
    }
    return 65;
  }

  get label(): string {
    return LABELS2[this.value];
  }

  equals(other: Semester): boolean {
    return this.code === other.code;
  }

  private static isValidCode(value: number): boolean {
    return 0 < value || value == 0;
  }

  get value(): SemesterValue {
    if (this.code < 40) {
      return "ene-mayo";
    } else if (this.code < 60) {
      return "verano";
    } else if (this.code < 70) {
      return "ago-dec";
    }
    return "semester";
  }
}


// export class Semester {
//   private constructor(private readonly code: SemesterCode) {}

//   static create(code: number): Semester {
//     if (code.toString().trim().length === 6) {
//       code = Number(code.toString().slice(4, 6));
//     }
//     if (!this.isValidCode(code)) {
//       console.log("=========================Semester create", code);
//       throw new Error(`Invalid semester code: ${code}`);
//     }

//     return new Semester(code);
//   }

//   getCode(): SemesterCode {
//     return this.code;
//   }

//   get label(): string {
//     return LABELS[this.code];
//   }

//   equals(other: Semester): boolean {
//     return this.code === other.code;
//   }

//   private static isValidCode(value: number): value is SemesterCode {
//     return 0 < value || value == 0; // Object.values(SEMESTER_CODES).includes(value as SemesterCode);
//   }

//   get value(): SemesterValue {
//     switch (this.code) {
//       case 10:
//       case 15:
//         return "ene-mayo";
//       case 40:
//       case 50:
//       case 55:
//         return "verano";
//       case 60:
//       case 65:
//         return "ago-dec";
//       default:
//         return "semester";
//     }
//   }
// }



//TODO 65????? 15????? 50??
export const SEMESTER_CODES = {
  SPRING: 10,
  SPRING_LATE: 15,
  SUMMER: 40,
  SUMMER_LATE: 50,
  SUMMER_LATE2: 55,
  FALL: 60,
  FALL_LATE: 65,
} as const;

export type SemesterCode = (typeof SEMESTER_CODES)[keyof typeof SEMESTER_CODES];

const LABELS: Record<SemesterCode, string> = {
  10: "Ene-Mayo",
  15: "15Ene-Mayo",
  40: "Verano",
  50: "50Verano",
  55: "55Verano",
  60: "Ago-Dic",
  65: "65Ago-Dic",
};

const LABELS2: Record<SemesterValue, string> = {
  "ene-mayo": "Ene-Mayo",
  verano: "Verano",
  "ago-dec": "Ago-Dic",
  semester: "Semester"
};
