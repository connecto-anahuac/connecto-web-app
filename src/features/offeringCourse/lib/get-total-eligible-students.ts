import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";

export function getTotalEligibleStudents(offeringCourse: OfferingCourse) {
	return Object.entries(offeringCourse.possibleStudentIds).reduce(
		(total, [semester, studentIds]) =>
			Number(semester) >= offeringCourse.semester ? total + studentIds.length : total,
		0,
	);
}