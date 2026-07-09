import { OfferingCourseRecord } from "@/external/domain/university";
import { OFFERING_SELECTION_PERIOD } from "@/external/domain/offering-course";
import { OfferingCourseRepository } from "@/external/repository/offering-course.repository";

export class GetSelectedOfferingCoursesService {
  constructor(private readonly repository: OfferingCourseRepository) {}

  async execute(career: string): Promise<OfferingCourseRecord[]> {
    return this.repository.findByCareerAndPeriod(career, OFFERING_SELECTION_PERIOD);
  }
}