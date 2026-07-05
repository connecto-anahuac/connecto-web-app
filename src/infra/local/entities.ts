// src/domain/entities/course.ts

export type CourseEntity = {
  key: string;
  keyCode: string;
  keyNumber: string;
  hours: number;
  credits: number;
  block: string;
  name: string;
};
export type PlanEntity = {
  id: string;
  name: string;
  career: string;
  courseKey: string;
  semester: number;
  position: number;
};

// src/domain/entities/pre-requisito.ts

export type PreRequisitoEntity = {
  id: string;
  currentCourseKey: string;
  preCourseKey: string;
};

// src/domain/entities/student.ts

export type StudentEntity = {
  id: string;
  name: string;
  status: string;
  enrolledPeriod: string;
  currentSemester: number;
  currentSemesterWithoutSummer: number;
};

// src/domain/entities/grade.ts

export type GradeEntity = {
  id?: number;
  studentId: string;
  courseKey: string;
  // period: string;
  // grade: number;

  grade: number | null;
  period: string | null;
  value: boolean | null;
  as: "default" | "TINT" | "REGIONALES";
};

export type OfferingCourseEntity = {
  id: string;
  period: string;
  career: string;
  courseKey: string;
  sessionNumber: number;
  estimatedNumber: number;
};