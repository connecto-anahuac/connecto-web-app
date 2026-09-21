import type {
  OfferingCourseDetail,
  OfferingCourseStudent,
  OfferingCourseStudyPlan,
} from "@/external/domain/offering-course";
import { passGrade } from "@/external/domain/offering-course";
import { CourseRepository } from "@/external/repository/course.repository";
import { GradeRepository } from "@/external/repository/grade.repository";
import { OfferingCourseRepository } from "@/external/repository/offering-course.repository";
import { PlanRepository } from "@/external/repository/plan.repository";
import { PreRequisitoRepository } from "@/external/repository/prerequisito.repository";
import { StudentRepository } from "@/external/repository/student.repository";
import { StudyPlanRepository } from "@/external/repository/study-plan.repository";
import { createOfferingCourseSelectionId } from "@/external/domain/offering-course";

const ACTIVE_STATUSES = new Set(["active", "activo"]);

const isActive = (status: string) => ACTIVE_STATUSES.has(
  status.trim().normalize("NFD")
    .replace(/\p{Diacritic}/gu, "").toLowerCase(),
);

export class GetOfferingCourseDetailService {
  constructor(
    private readonly plans: PlanRepository,
    private readonly studyPlans: StudyPlanRepository,
    private readonly courses: CourseRepository,
    private readonly students: StudentRepository,
    private readonly grades: GradeRepository,
    private readonly prerequisites: PreRequisitoRepository,
    private readonly offerings: OfferingCourseRepository,
  ) {}

  async execute(
    career: string,
    courseKey: string,
    period: string,
  ): Promise<OfferingCourseDetail | undefined> {
    const coursePlans = (await this.plans.findByCourseKey(courseKey))
      .filter((plan) => plan.planId);
    if (!coursePlans.length) return undefined;

    const [course, allStudyPlans, allStudents, selection] = await Promise.all([
      this.courses.findById(courseKey),
      this.studyPlans.findAll(),
      this.students.findAll(),
      this.offerings.findById(createOfferingCourseSelectionId(career, period, courseKey)),
    ]);
    const studyPlanById = new Map(allStudyPlans.map((plan) => [plan.id, plan]));
    const studentGrades = new Map(await Promise.all(allStudents.map(async (student) => [
      student.id,
      new Set((await this.grades.findStudentGrades(student.id))
        .filter((grade) => typeof grade.grade === "number" && grade.grade >= passGrade)
        .map((grade) => grade.courseKey)),
    ] as const)));
    const prerequisiteCache = new Map<string, string[]>();
    const resolvePrerequisites = async (key: string, ancestors = new Set<string>()): Promise<string[]> => {
      const cached = prerequisiteCache.get(key);
      if (cached) return cached;
      if (ancestors.has(key)) return [];
      const direct = await this.prerequisites.findRequiredFor(key);
      const nextAncestors = new Set(ancestors).add(key);
      const resolved = new Set(direct);
      for (const prerequisite of direct) {
        for (const nested of await resolvePrerequisites(prerequisite, nextAncestors)) resolved.add(nested);
      }
      const result = [...resolved];
      prerequisiteCache.set(key, result);
      return result;
    };

    const directPreRequisites = await this.prerequisites.findRequiredFor(courseKey);
    const requiredKeys = await resolvePrerequisites(courseKey);
    const toStudent = (student: (typeof allStudents)[number]): OfferingCourseStudent => ({
      id: student.id, name: student.name, avatarColorRef: student.avatarColorRef,
    });
    const studyPlans = coursePlans.flatMap((coursePlan): OfferingCourseStudyPlan[] => {
      const studyPlan = studyPlanById.get(coursePlan.planId!);
      if (!studyPlan) return [];
      const bySemester = new Map<number, { eligibleStudents: OfferingCourseStudent[]; studentsWithoutPrerequisites: OfferingCourseStudent[] }>();
      for (const student of allStudents) {
        const passed = studentGrades.get(student.id) ?? new Set<string>();
        if (!isActive(student.status) || student.career !== studyPlan.career || passed.has(courseKey)) continue;
        const bucket = bySemester.get(student.currentSemester) ?? { eligibleStudents: [], studentsWithoutPrerequisites: [] };
        if (requiredKeys.every((required) => passed.has(required))) bucket.eligibleStudents.push(toStudent(student));
        else bucket.studentsWithoutPrerequisites.push(toStudent(student));
        bySemester.set(student.currentSemester, bucket);
      }
      return [{
        studyPlanId: studyPlan.id,
        studyPlanName: studyPlan.name,
        career: studyPlan.career,
        recommendedSemester: coursePlan.semester,
        semesters: [...bySemester.entries()].sort(([left], [right]) => right - left).map(([semester, bucket]) => ({ semester, ...bucket })),
      }];
    }).sort((left, right) => left.studyPlanName.localeCompare(right.studyPlanName));

    const enabledStudentIdsByStudyPlan = selection
      ? this.resolveEnabledStudentIds(selection, studyPlans)
      : undefined;
    const representative = coursePlans.sort((left, right) => left.semester - right.semester || left.position - right.position)[0];
    return {
      key: course?.key ?? courseKey,
      keyCode: course?.keyCode ?? "",
      keyNumber: course?.keyNumber ?? "",
      hours: course?.hours ?? 0,
      credits: course?.credits ?? 0,
      block: course?.block ?? "",
      name: course?.name ?? representative.name,
      semester: representative.semester,
      position: representative.position,
      preRequisites: directPreRequisites,
      studyPlans,
      enabledStudentIdsByStudyPlan,
      estimatedNumber: enabledStudentIdsByStudyPlan
        ? this.countEnabledStudents(enabledStudentIdsByStudyPlan)
        : 0,
      sessionNumber: selection?.sessionNumber ?? 1,
    };
  }

  /**
   * A legacy offering only contains its aggregate. Its historic behaviour was
   * to enable every eligible student at or after the recommended semester, so
   * recreate that membership on read and let the next save persist it.
   */
  private resolveEnabledStudentIds(
    selection: { enabledStudentIdsByStudyPlan?: Record<string, string[]> },
    studyPlans: OfferingCourseStudyPlan[],
  ): Record<string, string[]> {
    if (selection.enabledStudentIdsByStudyPlan) {
      return Object.fromEntries(
        Object.entries(selection.enabledStudentIdsByStudyPlan).map(([studyPlanId, studentIds]) => [
          studyPlanId,
          [...new Set(studentIds)],
        ]),
      );
    }

    return Object.fromEntries(studyPlans.map((studyPlan) => [
      studyPlan.studyPlanId,
      [...new Set(studyPlan.semesters
        .filter((semester) => semester.semester >= studyPlan.recommendedSemester)
        .flatMap((semester) => semester.eligibleStudents.map((student) => student.id)))],
    ]));
  }

  private countEnabledStudents(enabledStudentIdsByStudyPlan: Record<string, string[]>): number {
    return Object.values(enabledStudentIdsByStudyPlan)
      .reduce((total, studentIds) => total + new Set(studentIds).size, 0);
  }
}
