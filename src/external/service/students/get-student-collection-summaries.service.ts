import {
  toStudentCollectionSummaryDto,
  type StudentCollectionSummaryDto,
} from "@/external/dto/student/student-collection.dto";
import { GradeRepository } from "@/external/repository/grade.repository";
import { PlanRepository } from "@/external/repository/plan.repository";
import { StudentRepository } from "@/external/repository/student.repository";
import { GRADE_NOT_FOUND_VALUE } from "@/shared/types/consts";

/**
 * Builds collection rows from three bulk reads.  The first grade encountered for
 * a student/course pair intentionally matches GradeRepository.findGrade(...).first().
 */
export class GetStudentCollectionSummariesService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly gradeRepository: GradeRepository,
    private readonly planRepository: PlanRepository,
  ) {}

  async execute(): Promise<StudentCollectionSummaryDto[]> {
    const [students, grades, plans] = await Promise.all([
      this.studentRepository.findAll(),
      this.gradeRepository.findAll(),
      this.planRepository.findAll(),
    ]);

    const plansByCareer = new Map<string, typeof plans>();
    for (const plan of plans) {
      const careerPlans = plansByCareer.get(plan.career);
      if (careerPlans) {
        careerPlans.push(plan);
      } else {
        plansByCareer.set(plan.career, [plan]);
      }
    }

    const gradesByStudentAndCourse = new Map<string, Map<string, (typeof grades)[number]>>();
    for (const grade of grades) {
      const gradesByCourse = gradesByStudentAndCourse.get(grade.studentId);
      if (!gradesByCourse) {
        gradesByStudentAndCourse.set(grade.studentId, new Map([[grade.courseKey, grade]]));
      } else if (!gradesByCourse.has(grade.courseKey)) {
        gradesByCourse.set(grade.courseKey, grade);
      }
    }

    return students.map((student) => {
      const careerPlans = plansByCareer.get(student.career) ?? [];
      if (careerPlans.length === 0) {
        return toStudentCollectionSummaryDto(student, 0, 0);
      }

      const gradesByCourse = gradesByStudentAndCourse.get(student.id);
      let passedClassCount = 0;
      let failedClassCount = 0;

      for (const plan of careerPlans) {
        const grade = gradesByCourse?.get(plan.courseKey)?.grade;
        if (typeof grade === "number" && grade !== GRADE_NOT_FOUND_VALUE) {
          if (grade >= 6) {
            passedClassCount += 1;
          } else {
            failedClassCount += 1;
          }
        }
      }

      return toStudentCollectionSummaryDto(
        student,
        Math.round((passedClassCount / careerPlans.length) * 100),
        failedClassCount,
      );
    });
  }
}
