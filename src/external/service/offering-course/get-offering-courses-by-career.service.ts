import { OfferingCourse, passGrade } from "@/external/domain/offering-course";

import { CourseRepository } from "@/external/repository/course.repository";
import { GradeRepository } from "@/external/repository/grade.repository";
import { PlanRepository } from "@/external/repository/plan.repository";
import { PreRequisitoRepository } from "@/external/repository/prerequisito.repository";
import { StudentRepository } from "@/external/repository/student.repository";

export class GetOfferingCoursesByCareerService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly courseRepository: CourseRepository,
    private readonly studentRepository: StudentRepository,
    private readonly preRequisitoRepository: PreRequisitoRepository,
    private readonly gradeRepository: GradeRepository,
  ) {}

  async execute(career: string): Promise<OfferingCourse[]> {
    const [plans, students] = await Promise.all([
      this.planRepository.findByCareer(career),
      // this.studentRepository.findAll(),
      this.studentRepository.findByCareer(career),
      //TODO Student変えれる必要がある
    ]);
    console.log(students);

    const sortedPlans = [...plans].sort((left, right) => {
      if (left.semester !== right.semester) {
        return left.semester - right.semester;
      }

      return left.position - right.position;
    });

    const studentPassedCourseMap = new Map<string, Set<string>>(
      await Promise.all(
        students.map(async (student) => {
          const grades = await this.gradeRepository.findStudentGrades(student.id);
          const passedCourseKeys = new Set(
            grades
              .filter((grade) => typeof grade.grade === "number" && grade.grade >= passGrade)
              .map((grade) => grade.courseKey),
          );

          return [student.id, passedCourseKeys] as const;
        }),
      ),
    );

    const directPreRequisiteCache = new Map<string, string[]>();
    const allPreRequisiteCache = new Map<string, string[]>();

    const getDirectPreRequisites = async (courseKey: string) => {
      const cached = directPreRequisiteCache.get(courseKey);
      if (cached) {
        return cached;
      }

      const requiredKeys = await this.preRequisitoRepository.findRequiredFor(courseKey);
      directPreRequisiteCache.set(courseKey, requiredKeys);
      return requiredKeys;
    };

    const getAllPreRequisites = async (
      courseKey: string,
      activeKeys: Set<string> = new Set(),
    ): Promise<string[]> => {
      const cached = allPreRequisiteCache.get(courseKey);
      if (cached) {
        return cached;
      }

      if (activeKeys.has(courseKey)) {
        return [];
      }

      const nextActiveKeys = new Set(activeKeys);
      nextActiveKeys.add(courseKey);

      const directRequiredKeys = await getDirectPreRequisites(courseKey);
      const resolvedKeys = new Set<string>(directRequiredKeys);

      for (const requiredKey of directRequiredKeys) {
        const nestedRequiredKeys = await getAllPreRequisites(requiredKey, nextActiveKeys);
        for (const nestedRequiredKey of nestedRequiredKeys) {
          resolvedKeys.add(nestedRequiredKey);
        }
      }

      const result = [...resolvedKeys];
      allPreRequisiteCache.set(courseKey, result);
      return result;
    };

    return Promise.all(
      sortedPlans.map(async (plan) => {
        const [course, directPreRequisites, requiredCourseKeys] = await Promise.all([
          this.courseRepository.findById(plan.courseKey),
          getDirectPreRequisites(plan.courseKey),
          getAllPreRequisites(plan.courseKey),
        ]);

        const eligibleStudents = students.filter((student) => {
          const passedCourseKeys = studentPassedCourseMap.get(student.id) ?? new Set<string>();

          if (passedCourseKeys.has(plan.courseKey)) {
            return false;
          }

          if (requiredCourseKeys.length === 0) {
            return true;
          }

          return requiredCourseKeys.every((requiredCourseKey) =>
            passedCourseKeys.has(requiredCourseKey),
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
          key: course?.key ?? plan.courseKey,
          keyCode: course?.keyCode ?? "",
          keyNumber: course?.keyNumber ?? "",
          hours: course?.hours ?? 0,
          credits: course?.credits ?? 0,
          block: course?.block ?? "",
          name: course?.name ?? plan.name,
          semester: plan.semester,
          position: plan.position,
          preRequisites: directPreRequisites,
          possibleStudentIds,
        } satisfies OfferingCourse;
      }),
    );
  }
}