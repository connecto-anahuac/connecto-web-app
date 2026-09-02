import type {
  Contact,
  StudentClassItem,
  StudentProfile,
} from "@/features/student/types";
import { GRADE_NOT_FOUND_VALUE } from "@/shared/types/consts";

export type StudentDetail = {
  profile: StudentProfile;
  avatarColorCssVar: string;
  career: string;
  plan: string;
  advanceLabel: string;
  advance: number;
  idealAdvance: number;
  failedCoursesCount: number;
  currentCoursesLabel: string;
  requirementLabel: string;
  requirements: Record<string, boolean>;
  contact: Contact;
  memo: string;
  imgSrc?: string;
};

/**
 * TODO Use real career and photoimage
 *
 * */

const requirementTestValue = {
  "EGEL": true,
  "Servicio Social": true,
  "Tesis": false,
};

export function buildStudentDetail(
  profile: StudentProfile,
  plan: StudentClassItem[],
  options: {
    avatarColorCssVar: string;
    career: string;
    planLabel: string;
  },
): StudentDetail {
  const gradedCourses = plan.filter(
    (item): item is StudentClassItem & { grade: number } =>
      typeof item.grade === "number" && item.grade !== GRADE_NOT_FOUND_VALUE,
  );
  const passedCourses = gradedCourses.filter(
    (item) => item.grade !== null && item.grade >= 6,
  );
  const failedCourses = gradedCourses.filter(
    (item) => item.grade !== null && item.grade < 6,
  );
  const currentCourses = plan.filter(
    (item) =>
      item.period &&
      (item.grade === null || item.grade === GRADE_NOT_FOUND_VALUE),
  );
  const totalCourses = plan.length || 1;
  const idealCourses = plan.filter(
    (item) => item.semester < profile.currentSemester,
  );
  const advance = Math.round((passedCourses.length / totalCourses) * 100);
  const idealAdvance = Math.round((idealCourses.length / totalCourses) * 100);

  const requirements = requirementTestValue;
  return {
    profile,
    avatarColorCssVar: options.avatarColorCssVar,
    career: options.career,
    plan: options.planLabel,
    advanceLabel: `${advance}%`,
    advance: advance,
    idealAdvance: idealAdvance,
    failedCoursesCount: failedCourses.length,
    currentCoursesLabel: currentCourses.length
      ? `${currentCourses.length} cruzado`
      : "0",
    requirements: requirements,
    requirementLabel: "1/3",
    contact: {
      schoolEmail: "no registrado",
      privateEmail: "no registrado",
      phone: "no registrado",
    },
    imgSrc: "/data/avator.png",
    memo: "Sin datos",
  };
}
