import { StudentEntity } from "@/infra/local/entities";
import { MateriaRepository } from "@/infra/local/repository/materia.repository";
import { PlanRepository } from "@/infra/local/repository/plan.repository";
import { StudentRepository } from "@/infra/local/repository/student.repository";
import { GradeRepository } from "@/infra/local/repository/grade.repository";
import { StudentClassItem } from "../types/types";
import { PreRequisitoRepository } from "@/infra/local/repository/prerequisito.repository";

export class GetStudentPlanUseCase {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly materiaRepository: MateriaRepository,
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
      const materia = await this.materiaRepository.findById(p.materiaKey as string);

      const grade = await this.gradeRepository.findGrade(studentId, p.materiaKey);
      // console.log(`Grade for student ${studentId} and materia ${p.materiaId}:`, grade);
      // fetch prerequisito entries for this materia
      const prereqs = await this.preRequisitoRepository.findByMateria(p.materiaKey as string);
      const preItems: StudentClassItem[] = [];
      for (const pr of prereqs) {
        const preMat = await this.materiaRepository.findById(pr.preMateriaKey);
        preItems.push({
          id: pr.preMateriaKey,
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
        id: p.materiaKey ?? p.id,
        keyCode: materia?.keyCode ?? "",
        keyNumber: materia?.keyNumber ?? "",
        name: materia?.name ?? p.name ?? "",
        hours: materia?.hours ?? 0,
        credits: materia?.credits ?? 0,
        block: materia?.block ?? "",
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