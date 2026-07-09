import { Period } from "../../shared/types/Period";
import { SemesterCount } from "../../shared/types/SemesterCount";

type StudentInput = {
  id: string;
  name: string;
  status: string;
  enrolledPeriod: number | string;
  regularSemestersCount: number;
  summerSemestersCount: number;
  avatarColorRef: number;
  career: string;
  failCount: number;
};

export class Student {
  id: string;
  name: string;
  status: string;
  enrolledPeriod: Period;
  semesterCount: SemesterCount;
  avatarColorRef: number;
  career: string;
  failCount: number;//TODO umber error check

  constructor({
    id,
    name,
    status,
    enrolledPeriod,
    regularSemestersCount,
    summerSemestersCount,
    avatarColorRef,
    career,
    failCount,
  }: StudentInput) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.enrolledPeriod = new Period(enrolledPeriod);
    this.semesterCount = {
      regular: regularSemestersCount,
      summer: summerSemestersCount,
    };
    this.avatarColorRef = avatarColorRef;
    this.career = career;
    this.failCount = failCount;
  }

  get currentSemester(): number {
    return Period.create(new Date()).diff(this.enrolledPeriod);
  }
}

// DON'T REMOVE HERE!!
// export type Student = {
//   id: string;
//   name: string;
//   status: string;
//   enrolledPeriod: string;
//   currentSemester: number;
//   regularSemestersCount: number;
//   summerSemestersCount: number;
//   avatarColorRef: number;
//   career: string;
// };
