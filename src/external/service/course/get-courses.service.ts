import type { CourseCollectionDto } from "@/external/dto/course/course.dto";
import { CourseRepository } from "@/external/repository/course.repository";
import { PreRequisitoRepository } from "@/external/repository/prerequisito.repository";

export class GetCoursesService {
  constructor(private courses: CourseRepository, private prerequisites: PreRequisitoRepository) {}
  async execute(): Promise<CourseCollectionDto[]> {
    const [courses, prerequisites] = await Promise.all([this.courses.findAll(), this.prerequisites.findAll()]);
    const courseByKey = new Map(courses.map((course) => [course.key, course]));
    const namesByCourse = new Map<string, string[]>();
    for (const relation of prerequisites) {
      const names = namesByCourse.get(relation.currentCourseKey) ?? [];
      names.push(courseByKey.get(relation.preCourseKey)?.name || relation.preCourseKey);
      namesByCourse.set(relation.currentCourseKey, names);
    }
    return courses.map((course) => ({ ...course, prerequisito: (namesByCourse.get(course.key) ?? []).join(", ") }));
  }
}

