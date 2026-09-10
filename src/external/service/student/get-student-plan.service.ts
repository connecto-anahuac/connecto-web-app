import { StudentClassItem } from "@/external/domain/student-plan";

import { CourseRepository } from "@/external/repository/course.repository";
import { GradeRepository } from "@/external/repository/grade.repository";
import { PlanRepository } from "@/external/repository/plan.repository";
import { PreRequisitoRepository } from "@/external/repository/prerequisito.repository";
import { StudentRepository } from "@/external/repository/student.repository";
import { GRADE_NOT_FOUND_VALUE, PERIOD_NOT_FOUND_VALUE } from "@/shared/types/consts";

export class GetStudentGradeService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly courseRepository: CourseRepository,
    private readonly studentRepository: StudentRepository,
    private readonly preRequisitoRepository: PreRequisitoRepository,
    private readonly gradeRepository: GradeRepository,
  ) {}

  async execute(studentId: string): Promise<StudentClassItem[]> {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    const plans = await this.planRepository.findByCareer(student.career);
    const result: StudentClassItem[] = [];

    const buildPreRequisite = async (
      courseKey: string,
      ancestors: ReadonlySet<string>,
    ): Promise<StudentClassItem> => {
      const [course, grade, prereqs] = await Promise.all([
        this.courseRepository.findById(courseKey),
        this.gradeRepository.findGrade(studentId, courseKey),
        this.preRequisitoRepository.findByCourse(courseKey),
      ]);
      const nextAncestors = new Set(ancestors).add(courseKey);
      const preRequisites = await Promise.all(
        prereqs
          .filter((prereq) => !nextAncestors.has(prereq.preCourseKey))
          .map((prereq) => buildPreRequisite(prereq.preCourseKey, nextAncestors)),
      );

      return {
        id: courseKey,
        keyCode: course?.keyCode ?? "",
        keyNumber: course?.keyNumber ?? "",
        name: course?.name ?? "",
        hours: course?.hours ?? 0,
        credits: course?.credits ?? 0,
        block: course?.block ?? "",
        preRequisites,
        period: grade?.period ?? PERIOD_NOT_FOUND_VALUE,
        grade: grade?.grade ?? GRADE_NOT_FOUND_VALUE,
        semester: 0,
        position: 0,
      };
    };

    for (const plan of plans) {
      const course = await this.courseRepository.findById(plan.courseKey as string);
      const grade = await this.gradeRepository.findGrade(studentId, plan.courseKey);
      const prereqs = await this.preRequisitoRepository.findByCourse(plan.courseKey as string);
      const rootAncestors = new Set<string>([plan.courseKey as string]);
      const preItems = await Promise.all(
        prereqs
          .filter((prereq) => !rootAncestors.has(prereq.preCourseKey))
          .map((prereq) => buildPreRequisite(prereq.preCourseKey, rootAncestors)),
      );

      result.push({
        id: plan.courseKey ?? plan.id,
        keyCode: course?.keyCode ?? "",
        keyNumber: course?.keyNumber ?? "",
        name: course?.name ?? plan.name ?? "",
        hours: course?.hours ?? 0,
        credits: course?.credits ?? 0,
        block: course?.block ?? "",
        preRequisites: preItems,
        period: grade?.period ?? PERIOD_NOT_FOUND_VALUE,
        grade:  grade?.grade ?? GRADE_NOT_FOUND_VALUE,
        semester: plan.semester ?? 0,
        position: plan.position ?? 0,
      });
    }

    return result;
  }
}
