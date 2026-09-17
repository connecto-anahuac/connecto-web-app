import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";
import type { AssignableProfessor } from "../../component/ProfessorAsignModal";
import type {
  ScheduleAssignmentCourse,
  ScheduleAssignmentOption,
  ScheduleAssignmentSession,
} from "../panel/ScheduleAssignmentPanel";
import { SCHEDULE_CONFLICT_MESSAGES, validateProfessorForSession } from "../../lib";
import type { ScheduleCourseDraft, ScheduleWeekDay } from "../../types";
import { getProfessorAvatarColor } from "../scheduleBuilderCanvas/ScheduleBuilderCanvasPresenter";
import type { SidePanelValue } from "@/shared/component/composite/sidePanel/SidePanel";
import type { ScheduleBuilderStore } from "../scheduleBuilderStore";

const OCCURRENCE_HOURS = 1.5;

export const SCHEDULE_DAY_OPTIONS: readonly ScheduleAssignmentOption[] = [
  { value: "monday", label: "Lunes" },
  { value: "tuesday", label: "Martes" },
  { value: "wednesday", label: "Miércoles" },
  { value: "thursday", label: "Jueves" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

export type ScheduleAssignmentPanelViewModel = {
  course: ScheduleAssignmentCourse;
  sessions: ScheduleAssignmentSession[];
  dayOptions: ScheduleAssignmentOption[];
  timeSlotOptions: ScheduleAssignmentOption[];
  classroomOptions: ScheduleAssignmentOption[];
  selectedSessionId: string;
};

export function createScheduleAssignmentPanelViewModel(
  data: ScheduleBuilderDataDto,
  courses: readonly ScheduleCourseDraft[],
  selectedCourseKey: string | null,
  selectedSessionNumber: number | null,
): ScheduleAssignmentPanelViewModel | null {
  const draft = courses.find(({ courseKey }) => courseKey === selectedCourseKey);
  const offering = data.offeringCourses.find(({ courseKey }) => courseKey === selectedCourseKey);
  if (!draft || !offering || draft.sessions.length === 0) return null;
  const selectedSession = draft.sessions.find(
    ({ sessionNumber }) => sessionNumber === selectedSessionNumber,
  ) ?? draft.sessions[0]!;
  const professorById = new Map(data.professors.map((professor) => [professor.id, professor]));
  const timeSlotById = new Map(data.timeSlots.map((slot) => [slot.id, slot]));

  return {
    course: {
      code: offering.course.keyCode,
      number: offering.course.keyNumber,
      name: offering.course.name,
      credits: offering.course.credits,
      hours: offering.course.hours,
      semester: String(offering.course.recommendedSemesters[0] ?? "--"),
      students: offering.estimatedNumber,
    },
    selectedSessionId: String(selectedSession.sessionNumber),
    sessions: draft.sessions.map((session) => ({
      id: String(session.sessionNumber),
      label: `Sesión ${session.sessionNumber}`,
      professorName: session.professorId
        ? professorById.get(session.professorId)?.name ?? session.professorId
        : null,
      capacity: session.capacity,
      requiredOccurrenceCount: session.requiredOccurrenceCount,
      occurrences: session.occurrences
        .slice()
        .sort((left, right) => left.occurrenceNumber - right.occurrenceNumber)
        .map((occurrence) => {
          const timeSlot = timeSlotById.get(occurrence.timeSlotId);
          return {
            id: occurrence.id,
            label: `Clase ${occurrence.occurrenceNumber}`,
            day: occurrence.day,
            timeSlotId: occurrence.timeSlotId,
            timeLabel: timeSlot
              ? `${timeSlot.startTime}–${timeSlot.endTime}`
              : occurrence.timeSlotId,
            classroomId: occurrence.classroomId ?? "",
            warningCodes: [...occurrence.conflictCodes],
          };
        }),
    })),
    dayOptions: [...SCHEDULE_DAY_OPTIONS],
    timeSlotOptions: data.timeSlots
      .slice()
      .sort((left, right) => left.position - right.position)
      .map((slot) => ({
        value: slot.id,
        label: `${slot.id} · ${slot.startTime}–${slot.endTime}`,
      })),
    classroomOptions: data.classrooms.map((classroom) => ({
      value: classroom.id,
      label: classroom.name,
    })),
  };
}

export function createAssignableProfessors(
  data: ScheduleBuilderDataDto,
  courses: ScheduleCourseDraft[],
  courseKey: string,
  sessionNumber: number,
): AssignableProfessor[] {
  const course = courses.find((candidate) => candidate.courseKey === courseKey);
  const session = course?.sessions.find((candidate) =>
    candidate.sessionNumber === sessionNumber);
  if (!course || !session) return [];

  return data.professors
    .filter((professor) =>
      ["active", "activo"].includes(professor.status.toLowerCase())
      && professor.courseCapabilities.includes(courseKey))
    .map((professor) => {
      const conflictCodes = validateProfessorForSession(
        professor.id,
        course,
        session,
        { courses, data },
      );
      const assignedOccurrences = courses.flatMap(({ sessions }) => sessions)
        .filter(({ professorId }) => professorId === professor.id)
        .reduce((total, assignedSession) => total + assignedSession.occurrences.length, 0);
      const availableSlots = professor.availability.filter(({ isAvailable }) => isAvailable).length;
      return {
        id: professor.id,
        fullName: professor.name,
        assignedHours: assignedOccurrences * OCCURRENCE_HOURS,
        totalHours: availableSlots * OCCURRENCE_HOURS,
        color: getProfessorAvatarColor(professor.id),
        active: true,
        courseCapable: true,
        disabledReasons: [...new Set(conflictCodes.map((code) =>
          SCHEDULE_CONFLICT_MESSAGES[code]))],
      };
    });
}

export function isScheduleWeekDay(value: string): value is ScheduleWeekDay {
  return SCHEDULE_DAY_OPTIONS.some((option) => option.value === value);
}

export function createScheduleSidePanelValue(
  isPanelOpen: boolean,
  model: ScheduleAssignmentPanelViewModel | null,
): SidePanelValue | null {
  return isPanelOpen && model
    ? { id: `${model.course.code}${model.course.number}:${model.selectedSessionId}`, type: "assignment" }
    : null;
}

export function removeContextMenuOccurrence(
  commands: Pick<ScheduleBuilderStore, "removeOccurrence" | "closeContextMenu">,
  occurrenceId: string,
): boolean {
  const removed = commands.removeOccurrence(occurrenceId);
  commands.closeContextMenu();
  return removed;
}
