import {
  getOfferingCoursesByCareerUseCase,
  getSelectedOfferingCoursesUseCase,
  setOfferingCourseselectionUseCase,
} from "@/infra/di";
import type { OfferingCourse } from "@/features/offeringMateria/entity";

type UpdateOfferingCourseSelectionParams = {
  career: string;
  estimatedNumber: number;
  isSelected: boolean;
  offeringCourse: OfferingCourse;
};

export async function fetchOfferingCoursesByCareer(career: string) {
  return getOfferingCoursesByCareerUseCase.execute(career);
}

export async function fetchSelectedOfferingCourses(career: string) {
  return getSelectedOfferingCoursesUseCase.execute(career);
}

export async function updateOfferingCourseselection(
  params: UpdateOfferingCourseSelectionParams,
) {
  return setOfferingCourseselectionUseCase.execute(params);
}