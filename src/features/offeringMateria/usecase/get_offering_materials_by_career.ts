import { GradeRepository } from "@/infra/local/repository/grade.repository";
import { MateriaRepository } from "@/infra/local/repository/materia.repository";
import { PlanRepository } from "@/infra/local/repository/plan.repository";
import { PreRequisitoRepository } from "@/infra/local/repository/prerequisito.repository";
import { StudentRepository } from "@/infra/local/repository/student.repository";
import { OfferingMaterial } from "../entity";
import { passGrade } from "../consts";

export class GetOfferingMaterialsByCareerUseCase {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly materiaRepository: MateriaRepository,
    private readonly studentRepository: StudentRepository,
    private readonly preRequisitoRepository: PreRequisitoRepository,
    private readonly gradeRepository: GradeRepository,
  ) {}

  async execute(career: string): Promise<OfferingMaterial[]> {
    const [plans, students] = await Promise.all([
      this.planRepository.findByCareer(career),
      this.studentRepository.findAll(),
    ]);

    //   console.log("plans", plans);
    const sortedPlans = [...plans].sort((left, right) => {
      if (left.semester !== right.semester) {
        return left.semester - right.semester;
      }

      return left.position - right.position;
    });

    const studentPassedMateriaMap = new Map<string, Set<string>>(
      await Promise.all(
        students.map(async (student) => {
          const grades = await this.gradeRepository.findStudentGrades(student.id);
          const passedMateriaKeys = new Set(
            grades
              .filter((grade) => typeof grade.grade === "number" && grade.grade >= passGrade)
              .map((grade) => grade.materiaKey),
          );

          return [student.id, passedMateriaKeys] as const;
        }),
      ),
    );

    const directPreRequisiteCache = new Map<string, string[]>();
    const allPreRequisiteCache = new Map<string, string[]>();

    const getDirectPreRequisites = async (materiaKey: string) => {
      const cached = directPreRequisiteCache.get(materiaKey);
      if (cached) {
        return cached;
      }

      const requiredKeys = await this.preRequisitoRepository.findRequiredFor(materiaKey);
      directPreRequisiteCache.set(materiaKey, requiredKeys);
      return requiredKeys;
    };

    const getAllPreRequisites = async (
      materiaKey: string,
      activeKeys: Set<string> = new Set(),
    ): Promise<string[]> => {
      const cached = allPreRequisiteCache.get(materiaKey);
      if (cached) {
        return cached;
      }

      if (activeKeys.has(materiaKey)) {
        return [];
      }

      const nextActiveKeys = new Set(activeKeys);
      nextActiveKeys.add(materiaKey);

      const directRequiredKeys = await getDirectPreRequisites(materiaKey);
      const resolvedKeys = new Set<string>(directRequiredKeys);

      for (const requiredKey of directRequiredKeys) {
        const nestedRequiredKeys = await getAllPreRequisites(requiredKey, nextActiveKeys);
        for (const nestedRequiredKey of nestedRequiredKeys) {
          resolvedKeys.add(nestedRequiredKey);
        }
      }

      const result = [...resolvedKeys];
      allPreRequisiteCache.set(materiaKey, result);
      return result;
    };

    return Promise.all(
      sortedPlans.map(async (plan) => {
        const [materia, directPreRequisites, requiredMateriaKeys] = await Promise.all([
          this.materiaRepository.findById(plan.materiaKey),
          getDirectPreRequisites(plan.materiaKey),
          getAllPreRequisites(plan.materiaKey),
        ]);

        const eligibleStudents = students.filter((student) => {
          const passedMateriaKeys = studentPassedMateriaMap.get(student.id) ?? new Set<string>();

          // exclude students who already passed this materia
          if (passedMateriaKeys.has(plan.materiaKey)) return false;

          if (requiredMateriaKeys.length === 0) {
            return true;
          }

          return requiredMateriaKeys.every((requiredMateriaKey) =>
            passedMateriaKeys.has(requiredMateriaKey),
          );
        });

        const possibleStudentIds = eligibleStudents.reduce<Record<number, string[]>>(
          (studentIdsBySemester, student) => {
            const semester = student.currentSemester;
            const currentStudentIds = studentIdsBySemester[semester] ?? [];

            studentIdsBySemester[semester] = [...currentStudentIds, student.id];
            return studentIdsBySemester;
          },
          {},
        );

        return {
          key: materia?.key ?? plan.materiaKey,
          keyCode: materia?.keyCode ?? "",
          keyNumber: materia?.keyNumber ?? "",
          hours: materia?.hours ?? 0,
          credits: materia?.credits ?? 0,
          block: materia?.block ?? "",
          name: materia?.name ?? plan.name,
          semester: plan.semester,
          position: plan.position,
          preRequisites: directPreRequisites,
          possibleStudentIds,
        } satisfies OfferingMaterial;
      }),
    );
  }
}