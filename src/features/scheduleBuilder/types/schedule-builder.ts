import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";

export const SCHEDULE_WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type ScheduleWeekDay = (typeof SCHEDULE_WEEK_DAYS)[number];
export type ScheduleCellId = `${ScheduleWeekDay}:${string}`;

export const SCHEDULE_CONFLICT_CODES = [
  "professor_unassigned",
  "professor_not_capable",
  "professor_unavailable",
  "professor_conflict",
  "classroom_unassigned",
  "classroom_not_found",
  "classroom_conflict",
  "recommended_semester_conflict",
] as const;

export type ScheduleConflictCode = (typeof SCHEDULE_CONFLICT_CODES)[number];

export type ScheduleOccurrence = {
  id: string;
  courseKey: string;
  sessionNumber: number;
  occurrenceNumber: number;
  day: ScheduleWeekDay;
  timeSlotId: string;
  classroomId: string | null;
  position: number;
  conflictCodes: ScheduleConflictCode[];
};

export type ScheduleSessionDraft = {
  sessionNumber: number;
  professorId: string | null;
  capacity: number;
  requiredOccurrenceCount: number;
  occurrences: ScheduleOccurrence[];
};

export type ScheduleCourseDraft = {
  id: string;
  courseKey: string;
  name: string;
  hours: number;
  recommendedSemesters: number[];
  sessions: ScheduleSessionDraft[];
};

export type ScheduleBuilderCourseDto = ScheduleBuilderDataDto["offeringCourses"][number];
export type ScheduleBuilderProfessor = ScheduleBuilderDataDto["professors"][number];
export type ScheduleBuilderClassroom = ScheduleBuilderDataDto["classrooms"][number];
