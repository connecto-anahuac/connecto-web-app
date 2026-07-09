import { Period } from "./Period";
import { SemesterCount } from "./SemesterCount";



type StudentInput = {
  id: string;
  name: string;
  status: string;
  enrolledPeriod: number | string;
  regularSemestersCount: number;
  summerSemestersCount: number;
  avatarColorRef: number;
  career: string;
};

export class Student {
  id: string;
  name: string;
  status: string;
  enrolledPeriod: Period;
  semesterCount: SemesterCount;
  avatarColorRef: number;
  career: string;

  constructor({
    id,
    name,
    status,
    enrolledPeriod,
    regularSemestersCount,
    summerSemestersCount,
    avatarColorRef,
    career,
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
  }

  get currentSemester(): number {
    return Period.create(new Date()).minus(this.enrolledPeriod);
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
