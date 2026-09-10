import type { OfferingCourse } from "@/external/domain/offering-course";
import { passGrade } from "@/external/domain/offering-course";
import { CourseRepository } from "@/external/repository/course.repository";
import { GradeRepository } from "@/external/repository/grade.repository";
import { PlanRepository } from "@/external/repository/plan.repository";
import { PreRequisitoRepository } from "@/external/repository/prerequisito.repository";
import { StudentRepository } from "@/external/repository/student.repository";

const ACTIVE_STATUSES = new Set(["active", "activo"]);

const isActive = (status: string) => ACTIVE_STATUSES.has(
  status.trim().normalize("NFD")
    .replace(/\p{Diacritic}/gu, "").toLowerCase(),
);

/** Produces only grid metadata. Student membership is intentionally detail-only. */
export class GetOfferingCoursesByCareerService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly courseRepository: CourseRepository,
    private readonly preRequisitoRepository: PreRequisitoRepository,
    private readonly studentRepository: StudentRepository,
    private readonly gradeRepository: GradeRepository,
  ) {}

  async execute(career: string): Promise<OfferingCourse[]> {
    const plans = await this.planRepository.findByCareer(career);
    const [allStudents, directPreRequisites] = await Promise.all([
      this.studentRepository.findAll(),
      Promise.all(plans.map(async (plan) => [
        plan.courseKey,
        await this.preRequisitoRepository.findRequiredFor(plan.courseKey),
      ] as const)),
    ]);
    const sortedPlans = [...plans].sort(
      (left, right) => left.semester - right.semester || left.position - right.position,
    );
    const representativePlans = [...new Map(
      sortedPlans.map((plan) => [plan.courseKey, plan]),
    ).values()];
    const studentGrades = new Map(await Promise.all(allStudents.map(async (student) => [
      student.id,
      new Set((await this.gradeRepository.findStudentGrades(student.id))
        .filter((grade) => typeof grade.grade === "number" && grade.grade >= passGrade)
        .map((grade) => grade.courseKey)),
    ] as const)));
    const directByCourseKey = new Map(directPreRequisites);
    const prerequisiteCache = new Map<string, string[]>();
    const resolvePrerequisites = async (courseKey: string, ancestors = new Set<string>()): Promise<string[]> => {
      const cached = prerequisiteCache.get(courseKey);
      if (cached) return cached;
      if (ancestors.has(courseKey)) return [];
      const direct = directByCourseKey.get(courseKey)
        ?? await this.preRequisitoRepository.findRequiredFor(courseKey);
      const nextAncestors = new Set(ancestors).add(courseKey);
      const resolved = new Set(direct);
      for (const prerequisite of direct) {
        for (const nested of await resolvePrerequisites(prerequisite, nextAncestors)) resolved.add(nested);
      }
      const result = [...resolved];
      prerequisiteCache.set(courseKey, result);
      return result;
    };

    return Promise.all(representativePlans.map(async (plan) => {
      const [course, preRequisites, requiredKeys] = await Promise.all([
        this.courseRepository.findById(plan.courseKey),
        Promise.resolve(directByCourseKey.get(plan.courseKey) ?? []),
        resolvePrerequisites(plan.courseKey),
      ]);
      const coursePlans = plans.filter((candidate) => candidate.courseKey === plan.courseKey);
      const estimatedNumber = coursePlans.reduce((total, coursePlan) => {
        const eligibleStudentIds = new Set(allStudents.flatMap((student) => {
          const passed = studentGrades.get(student.id) ?? new Set<string>();
          const isEligible = isActive(student.status)
            && student.career === career
            && !passed.has(plan.courseKey)
            && student.currentSemester >= coursePlan.semester
            && requiredKeys.every((required) => passed.has(required));
          return isEligible ? [student.id] : [];
        }));
        return total + eligibleStudentIds.size;
      }, 0);
      return {
        key: course?.key ?? plan.courseKey,
        keyCode: course?.keyCode ?? "",
        keyNumber: course?.keyNumber ?? "",
        hours: course?.hours ?? 0,
        credits: course?.credits ?? 0,
        block: course?.block ?? "",
        name: course?.name ?? plan.name,
        semester: plan.semester,
        position: plan.position,
        estimatedNumber,
        preRequisites,
      } satisfies OfferingCourse;
    }));
  }
}
