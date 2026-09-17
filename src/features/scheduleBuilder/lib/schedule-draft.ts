import type {
  ScheduleBuilderCourseDto,
  ScheduleCellId,
  ScheduleCourseDraft,
  ScheduleOccurrence,
  ScheduleSessionDraft,
  ScheduleWeekDay,
} from "../types";

export const DEFAULT_SESSION_CAPACITY = 15;
export const SCHEDULE_OCCURRENCE_HOURS = 1.5;

export function getRequiredOccurrenceCount(hours: number): number {
  return hours > 0 ? Math.ceil(hours / SCHEDULE_OCCURRENCE_HOURS) : 0;
}

export function createScheduleCellId(day: ScheduleWeekDay, timeSlotId: string): ScheduleCellId {
  return `${day}:${timeSlotId}`;
}

export function createOccurrenceId(
  courseKey: string,
  sessionNumber: number,
  occurrenceNumber: number,
): string {
  return `${courseKey}:session-${sessionNumber}:occurrence-${occurrenceNumber}`;
}

export function createScheduleCourseDraft(source: ScheduleBuilderCourseDto): ScheduleCourseDraft {
  const requiredOccurrenceCount = getRequiredOccurrenceCount(source.course.hours);
  return {
    id: source.id,
    courseKey: source.courseKey,
    name: source.course.name,
    hours: source.course.hours,
    recommendedSemesters: [...source.course.recommendedSemesters],
    sessions: Array.from({ length: source.sessionNumber }, (_, index): ScheduleSessionDraft => ({
      sessionNumber: index + 1,
      professorId: null,
      capacity: DEFAULT_SESSION_CAPACITY,
      requiredOccurrenceCount,
      occurrences: [],
    })),
  };
}

export function findNextIncompleteSession(course: ScheduleCourseDraft): ScheduleSessionDraft | undefined {
  return course.sessions.find(
    (session) => session.occurrences.length < session.requiredOccurrenceCount,
  );
}

export function isScheduleCourseComplete(course: ScheduleCourseDraft): boolean {
  return course.sessions.length > 0 && course.sessions.every(
    (session) => session.requiredOccurrenceCount > 0
      && session.occurrences.length >= session.requiredOccurrenceCount,
  );
}

type PlaceOccurrenceInput = {
  day: ScheduleWeekDay;
  timeSlotId: string;
  classroomId?: string | null;
  position?: number;
};

export function placeNextOccurrence(
  course: ScheduleCourseDraft,
  input: PlaceOccurrenceInput,
): { course: ScheduleCourseDraft; occurrence: ScheduleOccurrence } | undefined {
  const session = findNextIncompleteSession(course);
  if (!session || session.requiredOccurrenceCount === 0) return undefined;

  const usedNumbers = new Set(session.occurrences.map(({ occurrenceNumber }) => occurrenceNumber));
  let occurrenceNumber = 1;
  while (usedNumbers.has(occurrenceNumber)) occurrenceNumber += 1;

  const occurrence: ScheduleOccurrence = {
    id: createOccurrenceId(course.courseKey, session.sessionNumber, occurrenceNumber),
    courseKey: course.courseKey,
    sessionNumber: session.sessionNumber,
    occurrenceNumber,
    day: input.day,
    timeSlotId: input.timeSlotId,
    classroomId: input.classroomId ?? null,
    position: input.position ?? 0,
    conflictCodes: [],
  };

  return {
    occurrence,
    course: {
      ...course,
      sessions: course.sessions.map((candidate) => candidate.sessionNumber === session.sessionNumber
        ? { ...candidate, occurrences: [...candidate.occurrences, occurrence] }
        : candidate),
    },
  };
}

export function removeScheduleOccurrence(
  course: ScheduleCourseDraft,
  occurrenceId: string,
): ScheduleCourseDraft {
  return {
    ...course,
    sessions: course.sessions.map((session) => ({
      ...session,
      occurrences: session.occurrences.filter(({ id }) => id !== occurrenceId),
    })),
  };
}
