import { OfferingCourse } from "../entity";
import { OfferingCourseRepository } from "@/infra/local/repository/offering_Course.repository";
import { OFFERING_SELECTION_PERIOD, createOfferingCourseselectionId } from "./selection_config";

type ExecuteParams = {
  career: string;
  offeringCourse: OfferingCourse;
  estimatedNumber: number;
  isSelected: boolean;
};

export class SetOfferingCourseselectionUseCase {
  constructor(private readonly repository: OfferingCourseRepository) {}

  async execute({
    career,
    offeringCourse,
    estimatedNumber,
    isSelected,
  }: ExecuteParams): Promise<void> {
    const id = createOfferingCourseselectionId(career, offeringCourse.key);

    if (!isSelected) {
      await this.repository.delete(id);
      return;
    }

    await this.repository.save({
      id,
      period: OFFERING_SELECTION_PERIOD,
      career,
      courseKey: offeringCourse.key,
      sessionNumber: 0,
      estimatedNumber,
    });
  }
}