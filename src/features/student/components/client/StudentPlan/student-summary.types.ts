import type { Contact, StudentClassItem, StudentProfile } from "@/features/student/types";

export type StudentSummary = {
  profile: StudentProfile;
  avatarColorCssVar: string;
  career: string;
  plan: string;
  advanceLabel: string;
  failedCoursesCount: number;
  currentCoursesLabel: string;
  requirementLabel: string;
  contact: Contact;
  memo: string;
};

export function buildStudentSummary(
  profile: StudentProfile,
  plan: StudentClassItem[],
  options: {
    avatarColorCssVar: string;
    career: string;
    planLabel: string;
  },
): StudentSummary {
  const gradedCourses = plan.filter((item) => typeof item.grade === "number");
  const passedCourses = gradedCourses.filter((item) => item.grade !== null && item.grade >= 6);
  const failedCourses = gradedCourses.filter((item) => item.grade !== null && item.grade < 6);
  const currentCourses = plan.filter((item) => item.period && item.grade === null);
  const totalCourses = plan.length || 1;
  const advance = Math.round((passedCourses.length / totalCourses) * 100);

  return {
    profile,
    avatarColorCssVar: options.avatarColorCssVar,
    career: options.career,
    plan: options.planLabel,
    advanceLabel: `${advance}%`,
    failedCoursesCount: failedCourses.length,
    currentCoursesLabel: currentCourses.length ? `${currentCourses.length} cruzado` : "0",
    requirementLabel: "1/3",
    contact: {
      schoolEmail: "-",
      privateEmail: "-",
      phone: "-",
    },
    memo: "Sin datos",
  };
}