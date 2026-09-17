import {
  ensureScheduleBuilderDataDto,
  type ScheduleBuilderDataDto,
} from "@/external/dto/schedule-builder";
import type {
  ClassroomRepository,
} from "@/external/repository/classroom.repository";
import type { CourseRepository } from "@/external/repository/course.repository";
import type { OfferingCourseRepository } from "@/external/repository/offering-course.repository";
import type { PlanRepository } from "@/external/repository/plan.repository";
import type { ProfessorRepository } from "@/external/repository/professor.repository";
import type { TimeSlotRepository } from "@/external/repository/time-slot.repository";

type Dependencies = {
  offeringCourses: Pick<OfferingCourseRepository, "findByCareerAndPeriod">;
  courses: Pick<CourseRepository, "findAll">;
  plans: Pick<PlanRepository, "findByCareer">;
  professors: Pick<ProfessorRepository, "findAll" | "findCapabilities" | "findAvailabilities">;
  classrooms: Pick<ClassroomRepository, "findAll">;
  timeSlots: Pick<TimeSlotRepository, "findAll">;
};

const isBuilderTimeSlot = (id: string) => /^T(?:[1-9]|10)$/.test(id);

export class GetScheduleBuilderDataService {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(career: string, period: string): Promise<ScheduleBuilderDataDto> {
    const [selections, courses, plans, professors, capabilities, availabilities, classrooms, timeSlots] =
      await Promise.all([
        this.dependencies.offeringCourses.findByCareerAndPeriod(career, period),
        this.dependencies.courses.findAll(),
        this.dependencies.plans.findByCareer(career),
        this.dependencies.professors.findAll(),
        this.dependencies.professors.findCapabilities(),
        this.dependencies.professors.findAvailabilities(),
        this.dependencies.classrooms.findAll(),
        this.dependencies.timeSlots.findAll(),
      ]);

    const courseByKey = new Map(courses.map((course) => [course.key, course]));
    const semestersByCourse = new Map<string, Set<number>>();
    for (const plan of plans) {
      const semesters = semestersByCourse.get(plan.courseKey) ?? new Set<number>();
      semesters.add(plan.semester);
      semestersByCourse.set(plan.courseKey, semesters);
    }

    const scopedCapabilities = capabilities.filter((capability) => capability.period === period);
    const scopedAvailabilities = availabilities.filter((availability) => availability.period === period);

    return ensureScheduleBuilderDataDto({
      career,
      period,
      offeringCourses: selections
        .filter((selection) => selection.sessionNumber >= 1)
        .flatMap((selection) => {
          const course = courseByKey.get(selection.courseKey);
          if (!course) return [];
          return [{
            id: selection.id,
            courseKey: selection.courseKey,
            sessionNumber: selection.sessionNumber,
            estimatedNumber: selection.estimatedNumber,
            course: {
              ...course,
              recommendedSemesters: [...(semestersByCourse.get(course.key) ?? [])].sort((a, b) => a - b),
            },
          }];
        }),
      professors: professors.map((professor) => ({
        id: professor.id,
        name: professor.name,
        status: professor.status,
        career: professor.career,
        courseCapabilities: [...new Set(scopedCapabilities
          .filter((capability) => capability.professorId === professor.id)
          .map((capability) => capability.courseId))],
        availability: scopedAvailabilities
          .filter((availability) => availability.professorId === professor.id)
          .map(({ day, timeSlotId, isAvailable }) => ({ day, timeSlotId, isAvailable })),
      })),
      classrooms,
      timeSlots: timeSlots
        .filter((timeSlot) => isBuilderTimeSlot(timeSlot.id))
        .sort((a, b) => a.position - b.position),
    });
  }
}
