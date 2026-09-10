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
  /** Stable study-plan relation. Optional while legacy imports are being normalized. */
  planId?: string;
};

export type ProfessorRecord = {
  id: string;
  name: string;
  status: string;
  career: string;
  job: string;
  email1: string;
  email2: string;
  phone: string;
};
export type ProfessorCourseCapabilityRecord = {
  id: string;
  professorId: string;
  period: string;
  courseId: string;
};
export type CourseAssignmentRecord = {
  id: string;
  professorId: string;
  period: string;
  courseId: string;
  timeSlotId: string;
  classroomId: string;
};
export const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];

export type ProfessorAvailabilityRecord = {
  id: string;
  professorId: string;
  period: string;
  day: WeekDay;
  timeSlotId: string;
  isAvailable: boolean;
};
export type TimeSlotRecord = {
  id: string;
  startTime: string;
  endTime: string;
  position: number;
};
export type ClassroomRecord = {
  id: string;
  name: string;
  place: string;
  note: string;
  equipments: string[];
  admin: string;
};
export type StudyPlanRecord = {
  id: string;
  name: string;
  career: string;
  firstPeriod: string;
  admin: string;
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
  /**
   * The selected students grouped by study plan.  This remains optional so
   * records written before per-student selection was introduced can be read
   * and hydrated from their eligible students.
   */
  enabledStudentIdsByStudyPlan?: Record<string, string[]>;
};
