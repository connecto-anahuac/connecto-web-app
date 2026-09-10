export type OfferingCourse = {
  key: string;
  keyCode: string;
  keyNumber: string;
  hours: number;
  credits: number;
  block: string;
  name: string;
  semester: number;
  position: number;
  /** Sum of each study plan's unique eligible students in the active career. */
  estimatedNumber: number;
  preRequisites: string[];
};

export type OfferingCourseStudent = {
  id: string;
  name: string;
  avatarColorRef: number;
};

export type OfferingCourseSemester = {
  semester: number;
  eligibleStudents: OfferingCourseStudent[];
  studentsWithoutPrerequisites: OfferingCourseStudent[];
};

export type OfferingCourseStudyPlan = {
  studyPlanId: string;
  studyPlanName: string;
  career: string;
  /** The course's recommended semester within this study plan. */
  recommendedSemester: number;
  semesters: OfferingCourseSemester[];
};

export type OfferingCourseDetail = OfferingCourse & {
  studyPlans: OfferingCourseStudyPlan[];
  /** Enabled student IDs are persisted by study plan, never in grid data. */
  enabledStudentIdsByStudyPlan?: Record<string, string[]>;
  /** Sum of each study plan's unique enabled students in this career. */
  estimatedNumber: number;
  sessionNumber: number;
};

export const passGrade = 6;

export const OFFERING_SELECTION_PERIOD = "202660";

export function createOfferingCourseselectionId(career: string, courseKey: string): string {
  return `${career}:${OFFERING_SELECTION_PERIOD}:${courseKey}`;
}
