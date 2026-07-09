import { StudentClassItem } from "@/external/domain/student-plan";

import { CourseRepository } from "@/external/repository/course.repository";
import { GradeRepository } from "@/external/repository/grade.repository";
import { PlanRepository } from "@/external/repository/plan.repository";
import { PreRequisitoRepository } from "@/external/repository/prerequisito.repository";
import { StudentRepository } from "@/external/repository/student.repository";
import { GRADE_NOT_FOUND_VALUE } from "@/shared/types/consts";

export class GetStudentPlanService {
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

    const plans = await this.planRepository.findAll();
    const result: StudentClassItem[] = [];

    for (const plan of plans) {
      const course = await this.courseRepository.findById(plan.courseKey as string);
      const grade = await this.gradeRepository.findGrade(studentId, plan.courseKey);
      const prereqs = await this.preRequisitoRepository.findByCourse(plan.courseKey as string);
      const preItems: StudentClassItem[] = [];

      for (const prereq of prereqs) {
        const preCourse = await this.courseRepository.findById(prereq.preCourseKey);
        preItems.push({
          id: prereq.preCourseKey,
          keyCode: preCourse?.keyCode ?? "",
          keyNumber: preCourse?.keyNumber ?? "",
          name: preCourse?.name ?? "",
          hours: preCourse?.hours ?? 0,
          credits: preCourse?.credits ?? 0,
          block: preCourse?.block ?? "",
          preRequisites: [],
          period: "",
          grade: grade?.grade ?? GRADE_NOT_FOUND_VALUE,
          semester: 0,
          position: 0,
        });
      }

      result.push({
        id: plan.courseKey ?? plan.id,
        keyCode: course?.keyCode ?? "",
        keyNumber: course?.keyNumber ?? "",
        name: course?.name ?? plan.name ?? "",
        hours: course?.hours ?? 0,
        credits: course?.credits ?? 0,
        block: course?.block ?? "",
        preRequisites: preItems,
        period: grade?.period ?? "",
        grade:  grade?.grade ?? GRADE_NOT_FOUND_VALUE,
        semester: plan.semester ?? 0,
        position: plan.position ?? 0,
      });
    }

    return result;
  }
}