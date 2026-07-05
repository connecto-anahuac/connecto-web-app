import { OfferingCourseRepository } from "@/infra/local/repository/offering_Course.repository";
import { OfferingCourseEntity } from "@/infra/local/entities";
import { OFFERING_SELECTION_PERIOD } from "./selection_config";

export class GetSelectedOfferingCoursesUseCase {
  constructor(private readonly repository: OfferingCourseRepository) {}

  async execute(career: string): Promise<OfferingCourseEntity[]> {
    return this.repository.findByCareerAndPeriod(career, OFFERING_SELECTION_PERIOD);
  }
}