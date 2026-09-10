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
	/** Unique eligible students across the active career's study plans. */
	estimatedNumber: number;
	/** Detail-only data is loaded on demand; the grid intentionally has no student IDs. */
	possibleStudentIds?: Record<number, string[]>;
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
		estimatedNumber: offeringCourse.estimatedNumber,
	};
}

export function toUpdateOfferingCourseSelectionInput(
	offeringCourse: OfferingCourse,
	career: string,
	_sessionNumber: number,
	isSelected: boolean,
): UpdateOfferingCourseSelectionInput {
	return {
		career,
		courseKey: offeringCourse.key,
		isSelected,
	};
}
