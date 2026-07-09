import Dexie, { Table } from "dexie";

import {
  CourseEntity,
  GradeEntity,
  OfferingCourseEntity,
  PlanEntity,
  PreRequisitoEntity,
  StudentEntity,
} from "@/external/domain/university";

export class UniversityDB extends Dexie {
  courses!: Table<CourseEntity>;
  plans!: Table<PlanEntity>;
  students!: Table<StudentEntity>;
  grades!: Table<GradeEntity>;
  preRequisitos!: Table<PreRequisitoEntity>;
  offeringCourses!: Table<OfferingCourseEntity>;

  constructor() {
    super("UniversityDB");

    this.version(1).stores({
      courses: "key,keyCode,keyNumber,name",
      plans: "id,name,courseKey,career,semester,position",
      students: "id,name,status,currentSemester,currentSemesterWithoutSummer",
      grades: "++id,studentId,courseKey,period,grade",
      preRequisitos: "++id,currentCourseKey,preCourseKey",
    });

    this.version(2).stores({
      courses: "key,keyCode,keyNumber,name",
      plans: "id,name,courseKey,career,semester,position",
      students: "id,name,status,currentSemester,regularSemestersCount,summerSemestersCount,career",
      grades: "++id,studentId,courseKey,period,grade",
      preRequisitos: "++id,currentCourseKey,preCourseKey",
      offeringCourses: "id,period,career,courseKey,sessionNumber,estimatedNumber,[career+period]",
    });
  }
}

export const universityDb = new UniversityDB();