import {
  toOfferingCourseDto,
  toSelectedOfferingCourseDto,
  type OfferingCourseDto,
  type SelectedOfferingCourseDto,
  type UpdateOfferingCourseSelectionInput,
} from "@/external/dto/offering-course/offering-course.dto";
import {
  getOfferingCoursesByCareerService,
  getSelectedOfferingCoursesService,
  setOfferingCourseSelectionService,
} from "@/external/service/di";
export async function fetchOfferingCoursesByCareer(
  career: string,
): Promise<OfferingCourseDto[]> {
  const offeringCourses = await getOfferingCoursesByCareerService.execute(career);
  return offeringCourses.map(toOfferingCourseDto);
}

export async function fetchSelectedOfferingCourses(
  career: string,
): Promise<SelectedOfferingCourseDto[]> {
  const selectedOfferingCourses = await getSelectedOfferingCoursesService.execute(career);
  return selectedOfferingCourses.map(toSelectedOfferingCourseDto);
}

export async function updateOfferingCourseselection(
  params: UpdateOfferingCourseSelectionInput,
) {
  return setOfferingCourseSelectionService.execute(params);
}