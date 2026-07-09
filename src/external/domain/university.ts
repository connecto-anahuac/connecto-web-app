export type CourseRecord = {
  key: string;
  keyCode: string;
  keyNumber: string;
  hours: number;
  credits: number;
  block: string;
  name: string;
};

export type PlanRecord = {
  id: string;
  name: string;
  career: string;
  courseKey: string;
  semester: number;
  position: number;
};

export type PreRequisitoRecord = {
  id: string;
  currentCourseKey: string;
  preCourseKey: string;
};

export type StudentRecord = {
  id: string;
  name: string;
  status: string;
  career: string;
  enrolledPeriod: string;
  currentSemester: number;
  regularSemestersCount: number;
  summerSemestersCount: number;
  avatarColorRef: number;
  failCount: number;
};

export type GradeRecord = {
  id?: number;
  studentId: string;
  courseKey: string;
  grade: number | null;
  period: string | null;
  value: boolean | null;
  as: "default" | "TINT" | "REGIONALES";
};

export type OfferingCourseRecord = {
  id: string;
  period: string;
  career: string;
  courseKey: string;
  sessionNumber: number;
  estimatedNumber: number;
};