import type {
	OfferingCourseDto,
	UpdateOfferingCourseSelectionInput,
} from "@/external/dto/offering-course/offering-course.dto";

export type OfferingCourse = {
	key: string;
	keyCode: string;
	keyNumber: string;
	hours: number;
	credits: number;
	block: string;
	name: string;
	semester: number;
	position: number;
	preRequisites: string[];
	possibleStudentIds: Record<number, string[]>;
};

export function toOfferingCourseUI(offeringCourse: OfferingCourseDto): OfferingCourse {
	return {
		key: offeringCourse.key,
		keyCode: offeringCourse.keyCode,
		keyNumber: offeringCourse.keyNumber,
		hours: offeringCourse.hours,
		credits: offeringCourse.credits,
		block: offeringCourse.block,
		name: offeringCourse.name,
		semester: offeringCourse.semester,
		position: offeringCourse.position,
		preRequisites: [...offeringCourse.preRequisites],
		possibleStudentIds: Object.fromEntries(
			Object.entries(offeringCourse.possibleStudentIds).map(([semester, studentIds]) => [
				Number(semester),
				[...studentIds],
			]),
		) as Record<number, string[]>,
	};
}

export function toUpdateOfferingCourseSelectionInput(
	offeringCourse: OfferingCourse,
	career: string,
	estimatedNumber: number,
	isSelected: boolean,
): UpdateOfferingCourseSelectionInput {
	return {
		career,
		estimatedNumber,
		isSelected,
		offeringCourse: {
			key: offeringCourse.key,
			keyCode: offeringCourse.keyCode,
			keyNumber: offeringCourse.keyNumber,
			hours: offeringCourse.hours,
			credits: offeringCourse.credits,
			block: offeringCourse.block,
			name: offeringCourse.name,
			semester: offeringCourse.semester,
			position: offeringCourse.position,
			preRequisites: [...offeringCourse.preRequisites],
			possibleStudentIds: Object.fromEntries(
				Object.entries(offeringCourse.possibleStudentIds).map(([semester, studentIds]) => [
					Number(semester),
					[...studentIds],
				]),
			) as Record<number, string[]>,
		},
	};
}