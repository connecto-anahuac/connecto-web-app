import { SemesterType, SEMESTER_INDX } from "../../external/domain/consts";
import { Semester } from "./Semester";

export class Period {
  private rawPeriod: number;
  readonly year: number;
  readonly semester: Semester;
  constructor(rawPeriod: number | string) {
    const isValid = this.validate(rawPeriod);
    if (!isValid) {
      throw new Error(`Invalid period format. value: ${rawPeriod}`);
    }
    const {year: y, semesterNumber: s} = this.splitPeriod(rawPeriod.toString());
    this.year = y;
    // console.log("semesterNumber", s, SEMESTER_INDX[s]);
    this.semester = Semester.createFromPeriod(s);
    this.rawPeriod = Number(rawPeriod);

  }
  minus(other: Period): number {
    const yearDiff = this.year - other.year;
    const thisSlot = toRegularSemesterSlot(this.semester.getCode());
    const otherSlot = toRegularSemesterSlot(other.semester.getCode());
    const semesterDiff = thisSlot - otherSlot;

    return Math.max(0, yearDiff * 2 + semesterDiff + 1*Math.sign(yearDiff));
  }
  diff(other: Period): number {

    return Math.abs(this.minus(other));
  }

  equals(other: Period): boolean {
    return this.rawPeriod === other.rawPeriod;
  }

  greaterThan(other: Period): boolean {
    return this.rawPeriod > other.rawPeriod;
  }

  lessThan(other: Period): boolean {
    return this.rawPeriod < other.rawPeriod;
  }

  private splitPeriod(period: string): {
    year: number;
    semesterNumber: number;
  } {
    const year = Number(period.slice(0, 4));
    const semesterNumber = Number(period.slice(4));

    return { year, semesterNumber };
  }

  static create(date: Date): Period {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1; // Months are zero-based
    const semesterCode = currentMonth > 8 ? 60 : currentMonth <6?  10:40;
    return new Period(`${currentYear}${semesterCode}`);
  }

  static current(): Period {
    const now = new Date();
    return  Period.create(now);
  }

  private validate(value: number | string): boolean {
    // 文字列に変換し、前後の不要な空白をトリムしてから長さをチェック
    return value.toString().trim().length === 6;
  }

  get label(): string {
    return `${this.year} ${this.semester.label}`;
  }

  get raw(): number {
    return this.rawPeriod;
  }

 


}

function toRegularSemesterSlot(semesterCode: number): 1 | 2 {
  if (semesterCode < 60) {
    return 1;
  }

  // Summer/Fall are grouped into the second regular semester slot.
  return 2;
}



// export const estimateEnrolledPeriod = (currentSemester: number): Period => {
//   const now = new Date();
//   const currentYear = now.getFullYear();
//   const currentMonth = now.getMonth() + 1; // Months are zero-based
//   const currentSemnum = currentMonth > 8 ? 1 : 2;
//   const y = Math.floor(currentSemester / 2);
//   const y2 = currentSemester % 2;

//   if (currentSemnum === 2) {
//     if (y2 === 0) {
//       const semNum = currentSemnum;
//       const year = currentYear - y;
//       return { year, semester: getSemesterLabel(semNum) };
//     }
//     const semNum = currentSemnum - (y2 % 2) == 0 ? 2 : 1;
//     const year = currentYear - y - 1;
//     return { year, semester: getSemesterLabel(semNum) };
//   }
//   const semNum = currentSemnum - (y2 % 2) == 0 ? 2 : 1;
//   const year = currentYear - y;
//   return { year, semester: getSemesterLabel(semNum) };
// };

// const getSemesterLabel = (semester: number): SemesterType => {
//   const semLabel = semester === 1 ? "ene-mayo" : "ago-dec";
//   return semLabel;
// };
