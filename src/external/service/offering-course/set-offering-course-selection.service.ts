import {
  createOfferingCourseselectionId,
  OFFERING_SELECTION_PERIOD,
} from "@/external/domain/offering-course";

import { OfferingCourseRepository } from "@/external/repository/offering-course.repository";

type ExecuteParams = {
  career: string;
  courseKey: string;
  enabledStudentIdsByStudyPlan?: Record<string, string[]>;
  sessionNumber?: number;
  isSelected: boolean;
};

export class SetOfferingCourseSelectionService {
  constructor(private readonly repository: OfferingCourseRepository) {}

  async execute({
    career,
    courseKey,
    enabledStudentIdsByStudyPlan = {},
    sessionNumber = 1,
    isSelected,
  }: ExecuteParams): Promise<void> {
    const id = createOfferingCourseselectionId(career, courseKey);

    if (!isSelected) {
      await this.repository.delete(id);
      return;
    }

    const normalizedEnabledStudentIdsByStudyPlan = Object.fromEntries(
      Object.entries(enabledStudentIdsByStudyPlan).map(([studyPlanId, studentIds]) => [
        studyPlanId,
        [...new Set(studentIds)],
      ]),
    );
    const estimatedNumber = Object.values(normalizedEnabledStudentIdsByStudyPlan)
      .reduce((total, studentIds) => total + new Set(studentIds).size, 0);

    await this.repository.save({
      id,
      period: OFFERING_SELECTION_PERIOD,
      career,
      courseKey,
      sessionNumber,
      estimatedNumber,
      enabledStudentIdsByStudyPlan: normalizedEnabledStudentIdsByStudyPlan,
    });
  }
}
