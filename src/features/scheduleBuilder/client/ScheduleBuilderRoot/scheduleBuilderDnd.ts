import type {
  ScheduleCellId,
  ScheduleCourseDraft,
  ScheduleWeekDay,
} from "../../types";
import type { ScheduleBuilderStore } from "../scheduleBuilderStore";

const COURSE_PREFIX = "schedule-course:";
const OCCURRENCE_PREFIX = "schedule-occurrence:";
const CELL_PREFIX = "schedule-cell:";
export const OFFERING_COURSE_DROP_ID = "schedule-offering-course-list";

export const courseDragId = (courseKey: string) => `${COURSE_PREFIX}${courseKey}`;
export const occurrenceDragId = (occurrenceId: string) => `${OCCURRENCE_PREFIX}${occurrenceId}`;
export const scheduleCellDropId = (cellId: ScheduleCellId) => `${CELL_PREFIX}${cellId}`;

export type ScheduleBuilderDragSource =
  | { kind: "course"; courseKey: string }
  | { kind: "occurrence"; occurrenceId: string };

export type ScheduleBuilderDropTarget =
  | { kind: "offering-course-list" }
  | { kind: "cell"; cellId: ScheduleCellId; day: ScheduleWeekDay; timeSlotId: string; position?: number };

export function parseDragSource(id: string): ScheduleBuilderDragSource | null {
  if (id.startsWith(COURSE_PREFIX)) {
    return { kind: "course", courseKey: id.slice(COURSE_PREFIX.length) };
  }
  if (id.startsWith(OCCURRENCE_PREFIX)) {
    return { kind: "occurrence", occurrenceId: id.slice(OCCURRENCE_PREFIX.length) };
  }
  return null;
}

function splitCellId(cellId: ScheduleCellId) {
  const separator = cellId.indexOf(":");
  return {
    day: cellId.slice(0, separator) as ScheduleWeekDay,
    timeSlotId: cellId.slice(separator + 1),
  };
}

export function resolveDropTarget(
  overId: string,
  courses: readonly ScheduleCourseDraft[],
): ScheduleBuilderDropTarget | null {
  if (overId === OFFERING_COURSE_DROP_ID) return { kind: "offering-course-list" };
  if (overId.startsWith(CELL_PREFIX)) {
    const cellId = overId.slice(CELL_PREFIX.length) as ScheduleCellId;
    return { kind: "cell", cellId, ...splitCellId(cellId) };
  }
  if (overId.startsWith(OCCURRENCE_PREFIX)) {
    const targetId = overId.slice(OCCURRENCE_PREFIX.length);
    for (const course of courses) {
      for (const session of course.sessions) {
        const occurrence = session.occurrences.find(({ id }) => id === targetId);
        if (occurrence) {
          const cellId = `${occurrence.day}:${occurrence.timeSlotId}` as ScheduleCellId;
          return {
            kind: "cell",
            cellId,
            day: occurrence.day,
            timeSlotId: occurrence.timeSlotId,
            position: occurrence.position,
          };
        }
      }
    }
  }
  return null;
}

type DropCommands = Pick<
  ScheduleBuilderStore,
  "placeCourse" | "moveOccurrence" | "removeOccurrence" | "selectOccurrence"
>;

export function applyScheduleBuilderDrop(
  commands: DropCommands,
  source: ScheduleBuilderDragSource | null,
  target: ScheduleBuilderDropTarget | null,
): boolean {
  if (!source || !target) return false;
  if (source.kind === "occurrence" && target.kind === "offering-course-list") {
    return commands.removeOccurrence(source.occurrenceId);
  }
  if (target.kind !== "cell") return false;
  if (source.kind === "course") {
    return commands.placeCourse(
      source.courseKey,
      target.day,
      target.timeSlotId,
      target.position,
    ) !== null;
  }
  const moved = commands.moveOccurrence(
    source.occurrenceId,
    target.day,
    target.timeSlotId,
    target.position,
  );
  if (moved) commands.selectOccurrence(source.occurrenceId);
  return moved;
}
