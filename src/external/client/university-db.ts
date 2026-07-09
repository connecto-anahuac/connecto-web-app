import Dexie, { Table } from "dexie";

import {
  CourseRecord,
  GradeRecord,
  OfferingCourseRecord,
  PlanRecord,
  PreRequisitoRecord,
  StudentRecord,
} from "@/external/domain/university";

export class UniversityDB extends Dexie {
  courses!: Table<CourseRecord>;
  plans!: Table<PlanRecord>;
  students!: Table<StudentRecord>;
  grades!: Table<GradeRecord>;
  preRequisitos!: Table<PreRequisitoRecord>;
  offeringCourses!: Table<OfferingCourseRecord>;

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
      students: "id,name,status,enrolledPeriod,currentSemester,regularSemestersCount,summerSemestersCount,career,failCount,period",
      grades: "++id,studentId,courseKey,period,grade",
      preRequisitos: "++id,currentCourseKey,preCourseKey",
      offeringCourses: "id,period,career,courseKey,sessionNumber,estimatedNumber,[career+period]",
    });
  }
}

export const universityDb = new UniversityDB();