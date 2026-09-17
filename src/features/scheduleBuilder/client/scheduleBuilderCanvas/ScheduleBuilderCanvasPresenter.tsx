import type { MouseEvent, ReactElement, ReactNode } from "react";

import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";
import ScheduleClassCard from "@/features/scheduleBuilder/component/ClassCard";
import type { ScheduleClassCardProps } from "@/features/scheduleBuilder/component/ClassCard";
import ScheduleEmptyCell, {
  type ScheduleEmptyCellAvatar,
  type ScheduleEmptyCellStatus,
} from "@/features/scheduleBuilder/component/ScheduleEmptyCell";
import type {
  ScheduleCellId,
  ScheduleCourseDraft,
  ScheduleOccurrence,
  ScheduleWeekDay,
} from "@/features/scheduleBuilder/types";
import ColumnTitle from "@/shared/component/composite/diagram/ColumnTitle";
import { Diagram } from "@/shared/component/composite/diagram/Diagram";
import TimeSlotRowHeader from "@/shared/component/composite/diagram/TimeSlotRowHeader";
import { cn } from "@/shared/lib/util";

export const SCHEDULE_DAY_COLUMNS: readonly {
  id: ScheduleWeekDay;
  label: string;
}[] = [
  { id: "monday", label: "Lunes" },
  { id: "tuesday", label: "Martes" },
  { id: "wednesday", label: "Miércoles" },
  { id: "thursday", label: "Jueves" },
  { id: "friday", label: "Viernes" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
];

const PROFESSOR_AVATAR_COLORS = [
  "#00695c",
  "#1565c0",
  "#6a1b9a",
  "#ad1457",
  "#ef6c00",
  "#2e7d32",
  "#455a64",
] as const;

type TimeSlot = ScheduleBuilderDataDto["timeSlots"][number];
export type ScheduleBuilderCanvasPresenterProps = {
  className?: string;
  data: ScheduleBuilderDataDto | null;
  timeSlots?: readonly TimeSlot[];
  courses: readonly ScheduleCourseDraft[];
  selectedOccurrenceId: string | null;
  draggingOccurrenceId?: string | null;
  highlightedCellIds?: readonly ScheduleCellId[];
  invalidCellIds?: readonly ScheduleCellId[];
  dragOverCellIds?: readonly ScheduleCellId[];
  availableProfessorAvatars?: Readonly<
    Partial<Record<ScheduleCellId, readonly ScheduleEmptyCellAvatar[]>>
  >;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onAddCourse?: (cellId: ScheduleCellId) => void;
  onOccurrenceClick?: (occurrenceId: string) => void;
  onOccurrenceContextMenu?: (
    occurrenceId: string,
    event: MouseEvent<HTMLDivElement>,
  ) => void;
  renderOccurrence?: (
    occurrence: ScheduleOccurrence,
    cellId: ScheduleCellId,
    card: ReactElement<ScheduleClassCardProps>,
  ) => ReactNode;
  renderCell?: (
    cellId: ScheduleCellId,
    children: ReactNode,
    layout: ScheduleCellLayout,
  ) => ReactNode;
  onCanvasBackgroundClick?: () => void;
};

type LocatedOccurrence = {
  course: ScheduleCourseDraft;
  session: ScheduleCourseDraft["sessions"][number];
  occurrence: ScheduleOccurrence;
};

export type ScheduleCellLayout = {
  columnCount: 1 | 2 | 3;
  emptyCellColumnSpan: 1 | 2 | 3;
};

const GRID_COLUMN_CLASSES = ["grid-cols-1", "grid-cols-2", "grid-cols-3"] as const;
const GRID_COLUMN_SPAN_CLASSES = ["col-span-1", "col-span-2", "col-span-3"] as const;
const DAY_COLUMN_TRACKS = [
  "minmax(200px, 1fr)",
  "minmax(408px, 2fr)",
  "minmax(616px, 3fr)",
] as const;

function getCellLayout(
  columnCount: ScheduleCellLayout["columnCount"],
  occurrenceCount: number,
): ScheduleCellLayout {
  return {
    columnCount,
    emptyCellColumnSpan: (occurrenceCount < columnCount
      ? columnCount - occurrenceCount
      : columnCount) as 1 | 2 | 3,
  };
}

function toColumnCount(occurrenceCount: number): ScheduleCellLayout["columnCount"] {
  if (occurrenceCount >= 3) return 3;
  if (occurrenceCount === 2) return 2;
  return 1;
}

function getDayColumnCounts(
  occurrences: readonly LocatedOccurrence[],
  timeSlots: readonly TimeSlot[],
): ReadonlyMap<ScheduleWeekDay, ScheduleCellLayout["columnCount"]> {
  const visibleTimeSlotIds = new Set(timeSlots.map((timeSlot) => timeSlot.id));
  const occurrenceCountByCell = new Map<ScheduleCellId, number>();

  for (const { occurrence } of occurrences) {
    if (!visibleTimeSlotIds.has(occurrence.timeSlotId)) continue;

    const cellId = createCellId(occurrence.day, occurrence.timeSlotId);
    occurrenceCountByCell.set(cellId, (occurrenceCountByCell.get(cellId) ?? 0) + 1);
  }

  return new Map(
    SCHEDULE_DAY_COLUMNS.map(({ id: day }) => {
      const maximumOccurrenceCount = timeSlots.reduce(
        (maximum, timeSlot) =>
          Math.max(maximum, occurrenceCountByCell.get(createCellId(day, timeSlot.id)) ?? 0),
        0,
      );
      return [day, toColumnCount(maximumOccurrenceCount)] as const;
    }),
  );
}

export function getProfessorAvatarColor(professorId: string): string {
  let hash = 0;
  for (const character of professorId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return PROFESSOR_AVATAR_COLORS[hash % PROFESSOR_AVATAR_COLORS.length];
}

function createCellId(day: ScheduleWeekDay, timeSlotId: string): ScheduleCellId {
  return `${day}:${timeSlotId}`;
}

function cellStatus(
  cellId: ScheduleCellId,
  highlighted: ReadonlySet<ScheduleCellId>,
  invalid: ReadonlySet<ScheduleCellId>,
  dragOver: ReadonlySet<ScheduleCellId>,
): ScheduleEmptyCellStatus {
  if (invalid.has(cellId)) return "invalid";
  if (dragOver.has(cellId)) return "drag-over";
  if (highlighted.has(cellId)) return "highlighted";
  return "default";
}

function locateOccurrences(courses: readonly ScheduleCourseDraft[]): LocatedOccurrence[] {
  return courses.flatMap((course) =>
    course.sessions.flatMap((session) =>
      session.occurrences.map((occurrence) => ({ course, session, occurrence })),
    ),
  );
}

function withDeterministicColors(
  avatars: readonly ScheduleEmptyCellAvatar[],
): ScheduleEmptyCellAvatar[] {
  return avatars.map((avatar) => ({
    ...avatar,
    color: avatar.color ?? getProfessorAvatarColor(avatar.id ?? avatar.fullName),
  }));
}

export function ScheduleBuilderCanvasPresenter({
  className,
  data,
  timeSlots,
  courses,
  selectedOccurrenceId,
  draggingOccurrenceId = null,
  highlightedCellIds = [],
  invalidCellIds = [],
  dragOverCellIds = [],
  availableProfessorAvatars = {},
  loading = false,
  error = null,
  emptyMessage = "No hay cursos disponibles para crear el horario.",
  onAddCourse,
  onOccurrenceClick,
  onOccurrenceContextMenu,
  renderOccurrence,
  renderCell,
  onCanvasBackgroundClick,
}: ScheduleBuilderCanvasPresenterProps) {
  if (loading) {
    return (
      <div className={cn("grid h-full min-h-40 place-items-center", className)} data-state="loading">
        <p className="text-sm text-OnSurfaceVariant">Cargando horario…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("grid h-full min-h-40 place-items-center", className)} data-state="error">
        <p role="alert" className="text-sm text-Error">{error}</p>
      </div>
    );
  }

  const resolvedTimeSlots = [...(timeSlots ?? data?.timeSlots ?? [])]
    .sort((left, right) => left.position - right.position);

  if (!data || resolvedTimeSlots.length === 0 || courses.length === 0) {
    return (
      <div className={cn("grid h-full min-h-40 place-items-center", className)} data-state="empty">
        <p className="text-sm text-OnSurfaceVariant">{emptyMessage}</p>
      </div>
    );
  }

  const occurrences = locateOccurrences(courses);
  const dayColumnCounts = getDayColumnCounts(occurrences, resolvedTimeSlots);
  const gridTemplateColumns = `auto ${SCHEDULE_DAY_COLUMNS.map(({ id }) =>
    DAY_COLUMN_TRACKS[(dayColumnCounts.get(id) ?? 1) - 1]).join(" ")}`;
  const offeringByCourseKey = new Map(
    data.offeringCourses.map((offering) => [offering.courseKey, offering]),
  );
  const professorById = new Map(data.professors.map((professor) => [professor.id, professor]));
  const classroomById = new Map(data.classrooms.map((classroom) => [classroom.id, classroom]));
  const highlighted = new Set(highlightedCellIds);
  const invalid = new Set(invalidCellIds);
  const dragOver = new Set(dragOverCellIds);

  return (
    <section
      aria-label="Horario semanal"
      data-state="ready"
      className={cn("h-full w-full overflow-auto", className)}
      onPointerDown={(event) => {
        const target = event.target;
        if (target instanceof Element && !target.closest("[data-cell-id]")) {
          onCanvasBackgroundClick?.();
        }
      }}
    >
      <Diagram
        columnCount={SCHEDULE_DAY_COLUMNS.length}
        rowCount={resolvedTimeSlots.length}
        columnWidth="minmax(200px, 1fr)"
        gap="0.5rem"
        className="min-w-max p-2"
        style={{ gridTemplateColumns }}
      >
        <Diagram.Columns>
          {SCHEDULE_DAY_COLUMNS.map((day) => (
            <ColumnTitle key={day.id} text={day.label} className="" />
          ))}
        </Diagram.Columns>

        <Diagram.Rows>
          {resolvedTimeSlots.map((timeSlot) => (
            <TimeSlotRowHeader
              key={timeSlot.id}
              label={timeSlot.id}
              startTime={timeSlot.startTime}
              endTime={timeSlot.endTime}
              className="h-full "
            />
          ))}
        </Diagram.Rows>

        {resolvedTimeSlots.flatMap((timeSlot, rowIndex) =>
          SCHEDULE_DAY_COLUMNS.map((day, columnIndex) => {
            const cellId = createCellId(day.id, timeSlot.id);
            const cellOccurrences = occurrences
              .filter(({ occurrence }) =>
                occurrence.day === day.id && occurrence.timeSlotId === timeSlot.id)
              .sort((left, right) =>
                left.occurrence.position - right.occurrence.position
                || left.occurrence.id.localeCompare(right.occurrence.id));
            const status = cellStatus(cellId, highlighted, invalid, dragOver);
            const avatars = withDeterministicColors(availableProfessorAvatars[cellId] ?? []);
            const layout = getCellLayout(
              dayColumnCounts.get(day.id) ?? 1,
              cellOccurrences.length,
            );

            const cellContents = (
              <>
                {cellOccurrences.map(({ course, session, occurrence }) => {
                  const offering = offeringByCourseKey.get(course.courseKey);
                  const professor = session.professorId
                    ? professorById.get(session.professorId)
                    : undefined;
                  const classroom = occurrence.classroomId
                    ? classroomById.get(occurrence.classroomId)
                    : undefined;
                  const card = (
                    <ScheduleClassCard
                      type="builder"
                      key={occurrence.id}
                      data-occurrence-id={occurrence.id}
                      courseCode={offering?.course.keyCode ?? course.courseKey}
                      courseNumber={offering?.course.keyNumber ?? ""}
                      hours={course.hours}
                      title={course.name}
                      sessionNumber={session.sessionNumber}
                      recommendedSemester={course.recommendedSemesters[0] ?? 0}
                      classCount={session.requiredOccurrenceCount}
                      sessionStudents={session.capacity}
                      totalStudents={offering?.estimatedNumber}
                      professorName={professor?.name}
                      professorColor={professor ? getProfessorAvatarColor(professor.id) : undefined}
                      classroom={classroom?.name}
                      selected={selectedOccurrenceId === occurrence.id}
                      completed={session.occurrences.length >= session.requiredOccurrenceCount}
                      warning={occurrence.conflictCodes.length > 0}
                      dragging={draggingOccurrenceId === occurrence.id}
                      onClick={() => onOccurrenceClick?.(occurrence.id)}
                      onContextMenu={(event) => onOccurrenceContextMenu?.(occurrence.id, event)}
                      className="w-full min-w-[200px] cursor-grab"
                    />
                  );
                  return renderOccurrence
                    ? renderOccurrence(occurrence, cellId, card)
                    : card;
                })}

                <ScheduleEmptyCell
                  avatars={avatars}
                  status={status}
                  aria-label={`Añadir curso a ${day.label}, ${timeSlot.id}`}
                  onAdd={() => onAddCourse?.(cellId)}
                  className={cn(
                    "h-full min-h-24 w-full min-w-0",
                    GRID_COLUMN_SPAN_CLASSES[layout.emptyCellColumnSpan - 1],
                  )}
                />
              </>
            );

            return (
              <Diagram.Content
                key={cellId}
                x={columnIndex + 1}
                y={rowIndex + 1}
                data-cell-id={cellId}
                data-cell-state={status}
                className={cn(
                  "grid min-h-28 content-start gap-2",
                  GRID_COLUMN_CLASSES[layout.columnCount - 1],
                )}
              >
                {renderCell ? renderCell(cellId, cellContents, layout) : cellContents}
              </Diagram.Content>
            );
          }),
        )}
      </Diagram>
    </section>
  );
}

export default ScheduleBuilderCanvasPresenter;
