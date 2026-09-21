import type {
  OfferingCourse,
  OfferingCourseDetail,
  OfferingCourseSemester,
  OfferingCourseStudent,
  OfferingCourseStudyPlan,
} from "@/external/domain/offering-course";
import type { OfferingCourseRecord } from "@/external/domain/university";

/** Lightweight grid data. Student identifiers intentionally remain in detail. */
export type OfferingCourseDto = OfferingCourse;
export type OfferingCourseStudentDto = OfferingCourseStudent;
export type OfferingCourseSemesterDto = OfferingCourseSemester;
export type OfferingCourseStudyPlanDto = OfferingCourseStudyPlan;
export type OfferingCourseDetailDto = OfferingCourseDetail;

export type SelectedOfferingCourseDto = {
  id: string;
  period: string;
  career: string;
  courseKey: string;
  sessionNumber: number;
  estimatedNumber: number;
  enabledStudentIdsByStudyPlan?: Record<string, string[]>;
};

export type UpdateOfferingCourseSelectionInput = {
  career: string;
  period: string;
  courseKey: string;
  isSelected: boolean;
  enabledStudentIdsByStudyPlan?: Record<string, string[]>;
  sessionNumber?: number;
  /** Compatibility-only; selection total is calculated from unique student IDs. */
  estimatedNumber?: number;
};

const copyStudentIds = (byStudyPlan: Record<string, string[]>) =>
  Object.fromEntries(
    Object.entries(byStudyPlan).map(([studyPlanId, studentIds]) => [
      studyPlanId,
      [...new Set(studentIds)],
    ]),
  );

export function toOfferingCourseDto(offeringCourse: OfferingCourse): OfferingCourseDto {
  return {
    key: offeringCourse.key,
    keyCode: offeringCourse.keyCode,
    keyNumber: offeringCourse.keyNumber,
    hours: offeringCourse.hours,
    credits: offeringCourse.credits,
    block: offeringCourse.block,
    name: offeringCourse.name,
    semester: offeringCourse.semester,
    position: offeringCourse.position,
    estimatedNumber: offeringCourse.estimatedNumber,
    preRequisites: [...offeringCourse.preRequisites],
  };
}

export function toOfferingCourseDetailDto(detail: OfferingCourseDetail): OfferingCourseDetailDto {
  return {
    ...detail,
    preRequisites: [...detail.preRequisites],
    enabledStudentIdsByStudyPlan: detail.enabledStudentIdsByStudyPlan && copyStudentIds(detail.enabledStudentIdsByStudyPlan),
    studyPlans: detail.studyPlans.map((studyPlan) => ({
      ...studyPlan,
      semesters: studyPlan.semesters.map((semester) => ({
        ...semester,
        eligibleStudents: semester.eligibleStudents.map((student) => ({ ...student })),
        studentsWithoutPrerequisites: semester.studentsWithoutPrerequisites.map((student) => ({ ...student })),
      })),
    })),
  };
}

export function toSelectedOfferingCourseDto(
  offeringCourse: OfferingCourseRecord,
): SelectedOfferingCourseDto {
  return {
    id: offeringCourse.id,
    period: offeringCourse.period,
    career: offeringCourse.career,
    courseKey: offeringCourse.courseKey,
    sessionNumber: offeringCourse.sessionNumber,
    estimatedNumber: offeringCourse.estimatedNumber,
    enabledStudentIdsByStudyPlan: offeringCourse.enabledStudentIdsByStudyPlan
      ? copyStudentIds(offeringCourse.enabledStudentIdsByStudyPlan)
      : undefined,
  };
}
