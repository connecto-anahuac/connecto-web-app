import type { ScheduleEmptyCellAvatar } from "../../component/ScheduleEmptyCell";
import type {
  ScheduleBuilderProfessor,
  ScheduleCellId,
  ScheduleCourseDraft,
} from "../../types";
import type { ScheduleBuilderDragSource } from "./scheduleBuilderDnd";

export function getActiveHighlightCourseKey(
  activeDrag: ScheduleBuilderDragSource | null,
  selectedCourseKey: string | null,
  selectedOccurrenceId: string | null,
  courses: readonly ScheduleCourseDraft[],
): string | null {
  if (activeDrag?.kind === "course") return activeDrag.courseKey;
  if (activeDrag?.kind === "occurrence") {
    return courses.find((course) => course.sessions.some((session) =>
      session.occurrences.some(({ id }) => id === activeDrag.occurrenceId)))?.courseKey ?? null;
  }
  return selectedOccurrenceId ? null : selectedCourseKey;
}

export function getAvailableProfessorAvatars(
  professors: readonly ScheduleBuilderProfessor[],
  courses: readonly ScheduleCourseDraft[],
): Partial<Record<ScheduleCellId, ScheduleEmptyCellAvatar[]>> {
  const occupiedProfessorCells = new Set<string>();
  for (const course of courses) {
    for (const session of course.sessions) {
      if (!session.professorId) continue;
      for (const occurrence of session.occurrences) {
        occupiedProfessorCells.add(
          `${session.professorId}:${occurrence.day}:${occurrence.timeSlotId}`,
        );
      }
    }
  }

  const result: Partial<Record<ScheduleCellId, ScheduleEmptyCellAvatar[]>> = {};
  for (const professor of professors) {
    if (professor.status.toLowerCase() !== "active") continue;
    for (const availability of professor.availability) {
      if (!availability.isAvailable) continue;
      const cellId = `${availability.day}:${availability.timeSlotId}` as ScheduleCellId;
      if (occupiedProfessorCells.has(`${professor.id}:${cellId}`)) continue;
      (result[cellId] ??= []).push({ id: professor.id, fullName: professor.name });
    }
  }
  return result;
}
