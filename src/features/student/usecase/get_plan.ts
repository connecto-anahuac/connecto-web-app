import { CourseRepository } from "@/infra/local/repository/course.repository";
import { PlanRepository } from "@/infra/local/repository/plan.repository";
import { StudentRepository } from "@/infra/local/repository/student.repository";
import { GradeRepository } from "@/infra/local/repository/grade.repository";
import { StudentClassItem } from "../types/types";
import { PreRequisitoRepository } from "@/infra/local/repository/prerequisito.repository";

export class GetStudentPlanUseCase {
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
    // fetch all plans (ordered by position in repository)
    const plans = await this.planRepository.findAll();

    const result: StudentClassItem[] = [];

    for (const p of plans) {
      const course = await this.courseRepository.findById(p.courseKey as string);

      const grade = await this.gradeRepository.findGrade(studentId, p.courseKey);
      // console.log(`Grade for student ${studentId} and course ${p.courseId}:`, grade);
      // fetch prerequisito entries for this course
      const prereqs = await this.preRequisitoRepository.findByCourse(p.courseKey as string);
      const preItems: StudentClassItem[] = [];
      for (const pr of prereqs) {
        const preMat = await this.courseRepository.findById(pr.preCourseKey);
        preItems.push({
          id: pr.preCourseKey,
          keyCode: preMat?.keyCode ?? "",
          keyNumber: preMat?.keyNumber ?? "",
          name: preMat?.name ?? "",
          hours: preMat?.hours ?? 0,
          credits: preMat?.credits ?? 0,
          block: preMat?.block ?? "",
          preRequisites: [],

          period: "",
          grade: 0,

          semester: 0,
          position: 0,
        });
      }

      result.push({
        id: p.courseKey ?? p.id,
        keyCode: course?.keyCode ?? "",
        keyNumber: course?.keyNumber ?? "",
        name: course?.name ?? p.name ?? "",
        hours: course?.hours ?? 0,
        credits: course?.credits ?? 0,
        block: course?.block ?? "",
        preRequisites: preItems,

        period: grade?.period ?? "",
        grade: typeof grade?.grade === "number" ? (grade!.grade as number) : 0,

        semester: p.semester ?? 0,
        position: p.position ?? 0,
      });
    }

    return result;
  }
}