import {
  toOfferingCourseDto,
  toOfferingCourseDetailDto,
  toSelectedOfferingCourseDto,
  type OfferingCourseDto,
  type OfferingCourseDetailDto,
  type SelectedOfferingCourseDto,
} from "@/external/dto/offering-course/offering-course.dto";
import {
  getOfferingCoursesByCareerService,
  getOfferingCourseDetailService,
  getSelectedOfferingCoursesService,
} from "@/external/service/di";
export async function fetchOfferingCoursesByCareer(
  career: string,
): Promise<OfferingCourseDto[]> {
  const offeringCourses = await getOfferingCoursesByCareerService.execute(career);
  return offeringCourses.map(toOfferingCourseDto);
}

export async function fetchSelectedOfferingCourses(
  career: string,
  period: string,
): Promise<SelectedOfferingCourseDto[]> {
  const selectedOfferingCourses = await getSelectedOfferingCoursesService.execute(career, period);
  return selectedOfferingCourses.map(toSelectedOfferingCourseDto);
}

export async function fetchOfferingCourseDetail(
  career: string,
  courseKey: string,
  period: string,
): Promise<OfferingCourseDetailDto | undefined> {
  const detail = await getOfferingCourseDetailService.execute(career, courseKey, period);
  return detail ? toOfferingCourseDetailDto(detail) : undefined;
}
