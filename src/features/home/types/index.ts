export type NavItem = {
  label: string;
  active?: boolean;
};

export type SummaryItem = {
  label: string;
  value: string;
};

export type ContactAction = "mail" | "school" | "chat";

export type CourseRecord = {
  code: string;
  number: string;
  title: string;
  grade: string;
  registered: string;
  semesterRegistered: string;
  semesterRecommended: string;
  credit: string;
  hours: string;
  prerequisite: string;
  nextCourse: string;
};

export type StudentProfile = {
  program: string;
  planLabel: string;
  name: string;
  status: string;
  progressValue: string;
  progressSuffix: string;
  progressLabel: string;
  contactActions: ContactAction[];
  summaryItems: SummaryItem[];
};