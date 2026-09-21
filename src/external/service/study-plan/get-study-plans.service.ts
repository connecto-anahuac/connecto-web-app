import type { StudyPlanCollectionDto, StudyPlanDetailDto } from "@/external/dto/study-plan/study-plan.dto";
import { CourseRepository } from "@/external/repository/course.repository";
import { PlanRepository } from "@/external/repository/plan.repository";
import { PreRequisitoRepository } from "@/external/repository/prerequisito.repository";
import { StudyPlanRepository } from "@/external/repository/study-plan.repository";
export class GetStudyPlansService {
  constructor(private studyPlans: StudyPlanRepository, private relations: PlanRepository, private courses: CourseRepository, private prerequisites: PreRequisitoRepository) {}
  execute(): Promise<StudyPlanCollectionDto[]> { return this.studyPlans.findAll(); }
  async detail(id: string): Promise<StudyPlanDetailDto | undefined> {
    const [plan, relations, courses, prerequisites] = await Promise.all([this.studyPlans.findById(id), this.relations.findAll(), this.courses.findAll(), this.prerequisites.findAll()]);
    if (!plan) return undefined;
    const courseByKey = new Map(courses.map((course) => [course.key, course]));
    const prerequisitesByCourseKey = new Map<string, string[]>();
    for (const prerequisite of prerequisites) {
      const coursePrerequisites = prerequisitesByCourseKey.get(prerequisite.currentCourseKey) ?? [];
      coursePrerequisites.push(prerequisite.preCourseKey);
      prerequisitesByCourseKey.set(prerequisite.currentCourseKey, coursePrerequisites);
    }
    return {
      ...plan,
      courses: relations.filter((row) => row.planId === id).map((row) => {
        const course = courseByKey.get(row.courseKey);
        return { id: row.id, courseKey: row.courseKey, keyCode: course?.keyCode ?? "", keyNumber: course?.keyNumber ?? "", name: course?.name ?? row.courseKey, hours: course?.hours ?? 0, credits: course?.credits ?? 0, semester: row.semester, position: row.position, preRequisites: prerequisitesByCourseKey.get(row.courseKey) ?? [] };
      }).sort((a, b) => a.semester - b.semester || a.position - b.position),
    };
  }
}
