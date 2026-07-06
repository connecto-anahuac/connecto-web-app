import {
  createOfferingCourseselectionId,
  OFFERING_SELECTION_PERIOD,
  OfferingCourse,
} from "@/external/domain/offering-course";

import { OfferingCourseRepository } from "@/external/repository/offering-course.repository";

type ExecuteParams = {
  career: string;
  offeringCourse: OfferingCourse;
  estimatedNumber: number;
  isSelected: boolean;
};

export class SetOfferingCourseSelectionService {
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