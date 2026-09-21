export type StudyPlanCollectionDto = { id: string; name: string; career: string; firstPeriod: string; admin: string };
export type StudyPlanCourseDto = { id: string; courseKey: string; keyCode: string; keyNumber: string; name: string; hours: number; credits: number; semester: number; position: number; preRequisites: string[] };
export type StudyPlanDetailDto = StudyPlanCollectionDto & { courses: StudyPlanCourseDto[] };
