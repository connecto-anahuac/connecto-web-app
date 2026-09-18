import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";

import type {
  ScheduleConflictCode,
  ScheduleCourseDraft,
  ScheduleOccurrence,
  ScheduleSessionDraft,
} from "../types";

export const SCHEDULE_CONFLICT_MESSAGES: Record<ScheduleConflictCode, string> = {
  professor_unassigned: "Profesor sin asignar",
  professor_not_capable: "El profesor no puede impartir esta materia",
  professor_unavailable: "El profesor no está disponible en este horario",
  professor_conflict: "El profesor ya tiene otra clase en este horario",
  classroom_unassigned: "Salon sin asignar",
  classroom_not_found: "El salon asignada no existe",
  classroom_conflict: "El salon ya está ocupada en este horario",
  recommended_semester_conflict: "Otra materia del mismo semestre recomendado ocupa este horario",
};

type ValidationContext = {
  courses: ScheduleCourseDraft[];
  data: ScheduleBuilderDataDto;
};

type TargetCellInput = {
  course: ScheduleCourseDraft;
  session: ScheduleSessionDraft;
  day: ScheduleOccurrence["day"];
  timeSlotId: string;
  occurrenceId?: string;
};

const intersects = (left: number[], right: number[]) => {
  const values = new Set(left);
  return right.some((value) => values.has(value));
};

function findSession(
  courses: ScheduleCourseDraft[],
  occurrence: ScheduleOccurrence,
): ScheduleSessionDraft | undefined {
  return courses
    .find(({ courseKey }) => courseKey === occurrence.courseKey)
    ?.sessions.find(({ sessionNumber }) => sessionNumber === occurrence.sessionNumber);
}

function allOccurrences(courses: ScheduleCourseDraft[]) {
  return courses.flatMap((course) => course.sessions.flatMap((session) =>
    session.occurrences.map((occurrence) => ({ course, session, occurrence }))));
}

export function validateScheduleOccurrence(
  occurrence: ScheduleOccurrence,
  { courses, data }: ValidationContext,
): ScheduleConflictCode[] {
  const conflicts = new Set<ScheduleConflictCode>();
  const course = courses.find(({ courseKey }) => courseKey === occurrence.courseKey);
  const session = findSession(courses, occurrence);
  const professor = data.professors.find(({ id }) => id === session?.professorId);
  const others = allOccurrences(courses).filter(({ occurrence: candidate }) =>
    candidate.id !== occurrence.id
    && candidate.day === occurrence.day
    && candidate.timeSlotId === occurrence.timeSlotId);

  if (!session?.professorId) {
    conflicts.add("professor_unassigned");
  } else if (!professor?.courseCapabilities.includes(occurrence.courseKey)) {
    conflicts.add("professor_not_capable");
  }

  if (professor) {
    const isActive = ["active", "activo"].includes(professor.status.toLowerCase());
    const isAvailable = professor.availability.some((availability) =>
      availability.day === occurrence.day
      && availability.timeSlotId === occurrence.timeSlotId
      && availability.isAvailable);
    if (!isActive || !isAvailable) conflicts.add("professor_unavailable");
    if (others.some(({ session: otherSession }) => otherSession.professorId === professor.id)) {
      conflicts.add("professor_conflict");
    }
  }

  if (!occurrence.classroomId) {
    conflicts.add("classroom_unassigned");
  } else if (!data.classrooms.some(({ id }) => id === occurrence.classroomId)) {
    conflicts.add("classroom_not_found");
  } else if (others.some(({ occurrence: candidate }) =>
    candidate.classroomId === occurrence.classroomId)) {
    conflicts.add("classroom_conflict");
  }

  if (course && others.some(({ course: otherCourse }) =>
    intersects(course.recommendedSemesters, otherCourse.recommendedSemesters))) {
    conflicts.add("recommended_semester_conflict");
  }

  return [...conflicts];
}

/** Evaluates a prospective drop without requiring professor/classroom assignments yet. */
export function validateTargetCell(
  { course, session, day, timeSlotId, occurrenceId }: TargetCellInput,
  { courses, data }: ValidationContext,
): ScheduleConflictCode[] {
  const conflicts = new Set<ScheduleConflictCode>();
  const occupants = allOccurrences(courses).filter(({ occurrence }) =>
    occurrence.id !== occurrenceId
    && occurrence.day === day
    && occurrence.timeSlotId === timeSlotId);
  const activeProfessors = data.professors.filter(({ status }) =>
    ["active", "activo"].includes(status.toLowerCase()));
  const candidates = session.professorId
    ? activeProfessors.filter(({ id }) => id === session.professorId)
    : activeProfessors.filter(({ courseCapabilities }) => courseCapabilities.includes(course.courseKey));
  const capable = candidates.filter(({ courseCapabilities }) => courseCapabilities.includes(course.courseKey));
  const available = capable.filter((professor) => professor.availability.some((availability) =>
    availability.day === day && availability.timeSlotId === timeSlotId && availability.isAvailable));
  const unoccupied = available.filter((professor) => !occupants.some(
    ({ session: occupiedSession }) => occupiedSession.professorId === professor.id));

  if (capable.length === 0) conflicts.add("professor_not_capable");
  if (capable.length > 0 && available.length === 0) conflicts.add("professor_unavailable");
  if (available.length > 0 && unoccupied.length === 0) conflicts.add("professor_conflict");

  const occupiedClassrooms = new Set(occupants.map(({ occurrence }) => occurrence.classroomId));
  if (!data.classrooms.some(({ id }) => !occupiedClassrooms.has(id))) {
    conflicts.add("classroom_conflict");
  }
  if (occupants.some(({ course: otherCourse }) =>
    intersects(course.recommendedSemesters, otherCourse.recommendedSemesters))) {
    conflicts.add("recommended_semester_conflict");
  }

  return [...conflicts];
}

export function revalidateSchedule(
  courses: ScheduleCourseDraft[],
  data: ScheduleBuilderDataDto,
): ScheduleCourseDraft[] {
  return courses.map((course) => ({
    ...course,
    sessions: course.sessions.map((session) => ({
      ...session,
      occurrences: session.occurrences.map((occurrence) => ({
        ...occurrence,
        conflictCodes: validateScheduleOccurrence(occurrence, { courses, data }),
      })),
    })),
  }));
}

export function validateProfessorForSession(
  professorId: string,
  course: ScheduleCourseDraft,
  session: ScheduleSessionDraft,
  context: ValidationContext,
): ScheduleConflictCode[] {
  const proposedCourses = context.courses.map((candidateCourse) =>
    candidateCourse.courseKey !== course.courseKey
      ? candidateCourse
      : {
          ...candidateCourse,
          sessions: candidateCourse.sessions.map((candidateSession) =>
            candidateSession.sessionNumber === session.sessionNumber
              ? { ...candidateSession, professorId }
              : candidateSession),
        });
  const conflicts = new Set<ScheduleConflictCode>();
  for (const occurrence of session.occurrences) {
    for (const conflict of validateScheduleOccurrence(occurrence, {
      ...context,
      courses: proposedCourses,
    })) {
      if (conflict.startsWith("professor_")) conflicts.add(conflict);
    }
  }
  return [...conflicts];
}
