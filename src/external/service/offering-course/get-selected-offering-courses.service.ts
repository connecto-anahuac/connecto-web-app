import { OfferingCourseRecord } from "@/external/domain/university";
import { OfferingCourseRepository } from "@/external/repository/offering-course.repository";

export class GetSelectedOfferingCoursesService {
  constructor(private readonly repository: OfferingCourseRepository) {}

  async execute(career: string, period: string): Promise<OfferingCourseRecord[]> {
    return this.repository.findByCareerAndPeriod(career, period);
  }
}
