import { createStore } from "zustand/vanilla";

import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";

import {
  createScheduleCourseDraft,
  isScheduleCourseComplete,
  placeNextOccurrence,
  revalidateSchedule,
  validateTargetCell,
} from "../lib";
import type {
  ScheduleConflictCode,
  ScheduleCourseDraft,
  ScheduleOccurrence,
  ScheduleWeekDay,
} from "../types";

export type ScheduleBuilderSelection = {
  selectedCourseKey: string | null;
  selectedSessionNumber: number | null;
  selectedOccurrenceId: string | null;
};

export type ScheduleBuilderContextMenuTarget = {
  occurrenceId: string;
};

export type ScheduleBuilderState = ScheduleBuilderSelection & {
  career: string | null;
  period: string | null;
  isLoading: boolean;
  error: string | null;
  data: ScheduleBuilderDataDto | null;
  courses: ScheduleCourseDraft[];
  isPanelOpen: boolean;
  contextMenuTarget: ScheduleBuilderContextMenuTarget | null;
};

export type ScheduleBuilderCommands = {
  resetForScope: (career: string, period: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  hydrate: (data: ScheduleBuilderDataDto) => void;
  getTargetConflicts: (
    courseKey: string,
    day: ScheduleWeekDay,
    timeSlotId: string,
    occurrenceId?: string,
  ) => ScheduleConflictCode[];
  placeCourse: (
    courseKey: string,
    day: ScheduleWeekDay,
    timeSlotId: string,
    position?: number,
  ) => ScheduleOccurrence | null;
  moveOccurrence: (
    occurrenceId: string,
    day: ScheduleWeekDay,
    timeSlotId: string,
    position?: number,
  ) => boolean;
  removeOccurrence: (occurrenceId: string) => boolean;
  updateSessionProfessor: (
    courseKey: string,
    sessionNumber: number,
    professorId: string | null,
  ) => void;
  updateSessionCapacity: (
    courseKey: string,
    sessionNumber: number,
    capacity: number,
  ) => void;
  updateOccurrence: (
    occurrenceId: string,
    changes: Partial<Pick<ScheduleOccurrence, "day" | "timeSlotId" | "classroomId">>,
  ) => void;
  selectCourse: (courseKey: string | null) => void;
  selectSession: (courseKey: string, sessionNumber: number) => void;
  selectOccurrence: (occurrenceId: string) => void;
  clearSelection: () => void;
  closePanel: () => void;
  openContextMenu: (occurrenceId: string) => void;
  closeContextMenu: () => void;
};

export type ScheduleBuilderStore = ScheduleBuilderState & ScheduleBuilderCommands;

type OccurrenceLocation = {
  course: ScheduleCourseDraft;
  session: ScheduleCourseDraft["sessions"][number];
  occurrence: ScheduleOccurrence;
};

const emptySelection = (): ScheduleBuilderSelection => ({
  selectedCourseKey: null,
  selectedSessionNumber: null,
  selectedOccurrenceId: null,
});

const createEmptyState = (
  career: string | null,
  period: string | null,
): ScheduleBuilderState => ({
  career,
  period,
  isLoading: false,
  error: null,
  data: null,
  courses: [],
  ...emptySelection(),
  isPanelOpen: false,
  contextMenuTarget: null,
});

function findOccurrence(
  courses: ScheduleCourseDraft[],
  occurrenceId: string,
): OccurrenceLocation | undefined {
  for (const course of courses) {
    for (const session of course.sessions) {
      const occurrence = session.occurrences.find(({ id }) => id === occurrenceId);
      if (occurrence) return { course, session, occurrence };
    }
  }
  return undefined;
}

function updateCoursesOccurrence(
  courses: ScheduleCourseDraft[],
  occurrenceId: string,
  update: (occurrence: ScheduleOccurrence) => ScheduleOccurrence | null,
): ScheduleCourseDraft[] {
  return courses.map((course) => ({
    ...course,
    sessions: course.sessions.map((session) => ({
      ...session,
      occurrences: session.occurrences.flatMap((occurrence) => {
        if (occurrence.id !== occurrenceId) return [occurrence];
        const next = update(occurrence);
        return next ? [next] : [];
      }),
    })),
  }));
}

function orderCell(
  courses: ScheduleCourseDraft[],
  day: ScheduleWeekDay,
  timeSlotId: string,
  occurrenceId: string,
  requestedPosition?: number,
): ScheduleCourseDraft[] {
  const occupants = courses
    .flatMap((course) => course.sessions.flatMap(({ occurrences }) => occurrences))
    .filter((occurrence) => occurrence.day === day && occurrence.timeSlotId === timeSlotId)
    .sort((left, right) => left.position - right.position || left.id.localeCompare(right.id));
  const moving = occupants.find(({ id }) => id === occurrenceId);
  if (!moving) return courses;

  const withoutMoving = occupants.filter(({ id }) => id !== occurrenceId);
  const position = Math.max(0, Math.min(requestedPosition ?? withoutMoving.length, withoutMoving.length));
  withoutMoving.splice(position, 0, moving);
  const positions = new Map(withoutMoving.map(({ id }, index) => [id, index]));

  return courses.map((course) => ({
    ...course,
    sessions: course.sessions.map((session) => ({
      ...session,
      occurrences: session.occurrences.map((occurrence) => {
        const nextPosition = positions.get(occurrence.id);
        return nextPosition === undefined ? occurrence : { ...occurrence, position: nextPosition };
      }),
    })),
  }));
}

function normalizeCell(
  courses: ScheduleCourseDraft[],
  day: ScheduleWeekDay,
  timeSlotId: string,
): ScheduleCourseDraft[] {
  const occupants = courses
    .flatMap((course) => course.sessions.flatMap(({ occurrences }) => occurrences))
    .filter((occurrence) => occurrence.day === day && occurrence.timeSlotId === timeSlotId)
    .sort((left, right) => left.position - right.position || left.id.localeCompare(right.id));
  const positions = new Map(occupants.map(({ id }, index) => [id, index]));
  return courses.map((course) => ({
    ...course,
    sessions: course.sessions.map((session) => ({
      ...session,
      occurrences: session.occurrences.map((occurrence) => {
        const nextPosition = positions.get(occurrence.id);
        return nextPosition === undefined || nextPosition === occurrence.position
          ? occurrence
          : { ...occurrence, position: nextPosition };
      }),
    })),
  }));
}

function validate(courses: ScheduleCourseDraft[], data: ScheduleBuilderDataDto | null) {
  return data ? revalidateSchedule(courses, data) : courses;
}

export const selectCompletedCourseKeys = (state: ScheduleBuilderState): string[] =>
  state.courses.filter(isScheduleCourseComplete).map(({ courseKey }) => courseKey);

export const selectIsCourseComplete = (courseKey: string) =>
  (state: ScheduleBuilderState): boolean => {
    const course = state.courses.find((candidate) => candidate.courseKey === courseKey);
    return course ? isScheduleCourseComplete(course) : false;
  };

/** Browser-memory-only state for one Schedule Builder surface. */
export function createScheduleBuilderStore() {
  return createStore<ScheduleBuilderStore>((set, get) => ({
    ...createEmptyState(null, null),
    resetForScope: (career, period) => set(createEmptyState(career, period)),
    setLoading: (isLoading) => set({ isLoading, error: isLoading ? null : get().error }),
    setError: (error) => set({ error, isLoading: false }),
    hydrate: (data) => set((state) => {
      if (state.career !== data.career || state.period !== data.period) return state;
      const courses = validate(data.offeringCourses.map(createScheduleCourseDraft), data);
      return {
        data,
        courses,
        isLoading: false,
        error: null,
        ...emptySelection(),
        isPanelOpen: false,
        contextMenuTarget: null,
      };
    }),
    getTargetConflicts: (courseKey, day, timeSlotId, occurrenceId) => {
      const { courses, data } = get();
      if (!data) return [];
      const location = occurrenceId ? findOccurrence(courses, occurrenceId) : undefined;
      const course = location?.course
        ?? courses.find((candidate) => candidate.courseKey === courseKey);
      const session = location
        ? location.session
        : course?.sessions.find(({ occurrences, requiredOccurrenceCount }) =>
          occurrences.length < requiredOccurrenceCount);
      if (!course || !session) return [];
      return validateTargetCell({ course, session, day, timeSlotId, occurrenceId }, { courses, data });
    },
    placeCourse: (courseKey, day, timeSlotId, position) => {
      const state = get();
      const course = state.courses.find((candidate) => candidate.courseKey === courseKey);
      if (!course || !state.data) return null;
      const placed = placeNextOccurrence(course, { day, timeSlotId });
      if (!placed) return null;

      let courses = state.courses.map((candidate) =>
        candidate.courseKey === courseKey ? placed.course : candidate);
      courses = orderCell(courses, day, timeSlotId, placed.occurrence.id, position);
      courses = validate(courses, state.data);
      const occurrence = findOccurrence(courses, placed.occurrence.id)?.occurrence ?? placed.occurrence;
      set({
        courses,
        selectedCourseKey: courseKey,
        selectedSessionNumber: occurrence.sessionNumber,
        selectedOccurrenceId: occurrence.id,
        isPanelOpen: true,
        contextMenuTarget: null,
      });
      return occurrence;
    },
    moveOccurrence: (occurrenceId, day, timeSlotId, position) => {
      const state = get();
      const location = findOccurrence(state.courses, occurrenceId);
      if (!location || !state.data) return false;
      // Prospective validation deliberately excludes the moving occurrence itself.
      validateTargetCell({
        course: location.course,
        session: location.session,
        day,
        timeSlotId,
        occurrenceId,
      }, { courses: state.courses, data: state.data });

      const oldDay = location.occurrence.day;
      const oldTimeSlotId = location.occurrence.timeSlotId;
      let courses = updateCoursesOccurrence(state.courses, occurrenceId, (occurrence) => ({
        ...occurrence,
        day,
        timeSlotId,
      }));
      courses = normalizeCell(courses, oldDay, oldTimeSlotId);
      courses = orderCell(courses, day, timeSlotId, occurrenceId, position);
      set({ courses: validate(courses, state.data), contextMenuTarget: null });
      return true;
    },
    removeOccurrence: (occurrenceId) => {
      const state = get();
      const location = findOccurrence(state.courses, occurrenceId);
      if (!location) return false;
      let courses = updateCoursesOccurrence(state.courses, occurrenceId, () => null);
      courses = normalizeCell(courses, location.occurrence.day, location.occurrence.timeSlotId);
      const isSelected = state.selectedOccurrenceId === occurrenceId;
      set({
        courses: validate(courses, state.data),
        ...(isSelected ? emptySelection() : {}),
        isPanelOpen: isSelected ? false : state.isPanelOpen,
        contextMenuTarget: null,
      });
      return true;
    },
    updateSessionProfessor: (courseKey, sessionNumber, professorId) => set((state) => ({
      courses: validate(state.courses.map((course) => course.courseKey !== courseKey ? course : {
        ...course,
        sessions: course.sessions.map((session) => session.sessionNumber !== sessionNumber
          ? session
          : { ...session, professorId }),
      }), state.data),
    })),
    updateSessionCapacity: (courseKey, sessionNumber, capacity) => set((state) => ({
      courses: validate(state.courses.map((course) => course.courseKey !== courseKey ? course : {
        ...course,
        sessions: course.sessions.map((session) => session.sessionNumber !== sessionNumber
          ? session
          : { ...session, capacity }),
      }), state.data),
    })),
    updateOccurrence: (occurrenceId, changes) => set((state) => {
      const location = findOccurrence(state.courses, occurrenceId);
      if (!location) return state;
      const nextDay = changes.day ?? location.occurrence.day;
      const nextTimeSlotId = changes.timeSlotId ?? location.occurrence.timeSlotId;
      let courses = updateCoursesOccurrence(state.courses, occurrenceId, (occurrence) => ({
        ...occurrence,
        ...changes,
      }));
      if (nextDay !== location.occurrence.day || nextTimeSlotId !== location.occurrence.timeSlotId) {
        courses = normalizeCell(courses, location.occurrence.day, location.occurrence.timeSlotId);
        courses = orderCell(courses, nextDay, nextTimeSlotId, occurrenceId);
      }
      return { courses: validate(courses, state.data) };
    }),
    selectCourse: (courseKey) => set({
      selectedCourseKey: courseKey,
      selectedSessionNumber: courseKey ? (get().courses.find((course) => course.courseKey === courseKey)?.sessions[0]?.sessionNumber ?? null) : null,
      selectedOccurrenceId: null,
      contextMenuTarget: null,
    }),
    selectSession: (courseKey, sessionNumber) => set({
      selectedCourseKey: courseKey,
      selectedSessionNumber: sessionNumber,
      selectedOccurrenceId: null,
      contextMenuTarget: null,
    }),
    selectOccurrence: (occurrenceId) => {
      const location = findOccurrence(get().courses, occurrenceId);
      if (!location) return;
      set({
        selectedCourseKey: location.course.courseKey,
        selectedSessionNumber: location.session.sessionNumber,
        selectedOccurrenceId: occurrenceId,
        isPanelOpen: true,
        contextMenuTarget: null,
      });
    },
    clearSelection: () => set({ ...emptySelection(), isPanelOpen: false, contextMenuTarget: null }),
    closePanel: () => set({ isPanelOpen: false }),
    openContextMenu: (occurrenceId) => {
      if (!findOccurrence(get().courses, occurrenceId)) return;
      set({ contextMenuTarget: { occurrenceId } });
    },
    closeContextMenu: () => set({ contextMenuTarget: null }),
  }));
}
