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
  /** Uses the compact, display-only semester selection indicator. */
  isMulti?: boolean;
  label: string;
  studentsWithoutPrerequisites?: OfferingCoursePanelStudent[];
};

export type OfferingCoursePanelPlan = {
  id: string;
  label: string;
  semesters: OfferingCoursePanelSemester[];
};

export type EnabledStudentIdsByStudyPlan = Record<string, string[]>;
/** @deprecated Use EnabledStudentIdsByStudyPlan. */
export type SelectedStudentIdsByStudyPlan = EnabledStudentIdsByStudyPlan;
