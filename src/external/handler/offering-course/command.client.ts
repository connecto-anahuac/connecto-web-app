import type { UpdateOfferingCourseSelectionInput } from "@/external/dto/offering-course/offering-course.dto";
import { setOfferingCourseSelectionService } from "@/external/service/di";

export async function updateOfferingCourseSelection(
  params: UpdateOfferingCourseSelectionInput,
): Promise<void> {
  return setOfferingCourseSelectionService.execute(params);
}
