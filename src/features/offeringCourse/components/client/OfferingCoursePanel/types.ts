export type OfferingCoursePanelStudent = {
  avatarColor?: string;
  fullName: string;
  id: string;
  /** Students without the prerequisite remain visible, but cannot be offered. */
  isEligible?: boolean;
};

export type OfferingCoursePanelSemester = {
  expectedStudents: OfferingCoursePanelStudent[];
  id: string;
  label: string;
  semester?: number;
  studentsWithoutPrerequisites?: OfferingCoursePanelStudent[];
};

export type OfferingCoursePanelPlan = {
  id: string;
  label: string;
  recommendedSemester?: number;
  semesters: OfferingCoursePanelSemester[];
};

export type EnabledStudentIdsByStudyPlan = Record<string, string[]>;
/** @deprecated Use EnabledStudentIdsByStudyPlan. */
export type SelectedStudentIdsByStudyPlan = EnabledStudentIdsByStudyPlan;
