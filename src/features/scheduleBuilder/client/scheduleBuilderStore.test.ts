import { describe, expect, it } from "vitest";

import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";

import {
  createScheduleBuilderStore,
  selectCompletedCourseKeys,
  selectIsCourseComplete,
} from "./scheduleBuilderStore";

const courseDto = (
  courseKey: string,
  options: { hours?: number; sessionNumber?: number; semesters?: number[] } = {},
): ScheduleBuilderDataDto["offeringCourses"][number] => ({
  id: `offering-${courseKey}`,
  courseKey,
  sessionNumber: options.sessionNumber ?? 1,
  estimatedNumber: 20,
  course: {
    key: courseKey,
    keyCode: courseKey.slice(0, 1),
    keyNumber: courseKey.slice(1),
    name: `Course ${courseKey}`,
    hours: options.hours ?? 1.5,
    credits: 4,
    block: "A",
    recommendedSemesters: options.semesters ?? [3],
  },
});

const makeData = (overrides: Partial<ScheduleBuilderDataDto> = {}): ScheduleBuilderDataDto => ({
  career: "IT",
  period: "202660",
  offeringCourses: [
    courseDto("C1", { hours: 3, sessionNumber: 2 }),
    courseDto("C2", { semesters: [5] }),
  ],
  professors: [{
    id: "P1",
    name: "Ada",
    status: "active",
    career: "IT",
    courseCapabilities: ["C1", "C2"],
    availability: [
      { day: "monday", timeSlotId: "T1", isAvailable: true },
      { day: "tuesday", timeSlotId: "T1", isAvailable: true },
      { day: "wednesday", timeSlotId: "T1", isAvailable: true },
      { day: "thursday", timeSlotId: "T1", isAvailable: true },
    ],
  }],
  classrooms: [
    { id: "R1", name: "One", place: "", note: "", equipments: [], admin: "" },
    { id: "R2", name: "Two", place: "", note: "", equipments: [], admin: "" },
  ],
  timeSlots: [{ id: "T1", startTime: "08:00", endTime: "09:30", position: 1 }],
  ...overrides,
});

const occurrenceById = (
  store: ReturnType<typeof createScheduleBuilderStore>,
  occurrenceId: string,
) => store.getState().courses
  .flatMap(({ sessions }) => sessions.flatMap(({ occurrences }) => occurrences))
  .find(({ id }) => id === occurrenceId);

describe("scheduleBuilderStore", () => {
  it("hydrates every selected offering into browser-memory drafts and rejects stale scopes", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("IT", "202660");
    store.getState().setLoading(true);
    store.getState().hydrate(makeData());

    expect(store.getState()).toMatchObject({
      career: "IT",
      period: "202660",
      isLoading: false,
      error: null,
    });
    expect(store.getState().courses).toHaveLength(2);
    expect(store.getState().courses[0].sessions).toHaveLength(2);
    expect(store.getState().courses[0].sessions.map(({ capacity }) => capacity)).toEqual([15, 15]);

    store.getState().hydrate(makeData({ period: "202710", offeringCourses: [courseDto("STALE")] }));
    expect(store.getState().courses.map(({ courseKey }) => courseKey)).toEqual(["C1", "C2"]);
  });

  it("clears placements, selections, panel, and context menu when either scope changes", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("IT", "202660");
    store.getState().hydrate(makeData());
    const placed = store.getState().placeCourse("C1", "monday", "T1");
    store.getState().openContextMenu(placed!.id);
    store.getState().resetForScope("IT", "202710");

    expect(store.getState()).toMatchObject({
      career: "IT",
      period: "202710",
      data: null,
      courses: [],
      selectedCourseKey: null,
      selectedSessionNumber: null,
      selectedOccurrenceId: null,
      isPanelOpen: false,
      contextMenuTarget: null,
    });
  });

  it("derives completion from every assignment and reverts when one becomes invalid", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("IT", "202660");
    store.getState().hydrate(makeData());

    const days = ["monday", "tuesday", "wednesday", "thursday"] as const;
    const placed = days.map((day) => store.getState().placeCourse("C1", day, "T1"));

    expect(placed.every(Boolean)).toBe(true);
    expect(store.getState().courses[0].sessions.map(({ occurrences }) => occurrences.length)).toEqual([2, 2]);
    expect(selectIsCourseComplete("C1")(store.getState())).toBe(false);
    expect(selectCompletedCourseKeys(store.getState())).not.toContain("C1");

    store.getState().updateSessionProfessor("C1", 1, "P1");
    store.getState().updateSessionProfessor("C1", 2, "P1");
    for (const occurrence of placed) {
      store.getState().updateOccurrence(occurrence!.id, { classroomId: "R1" });
    }

    expect(selectIsCourseComplete("C1")(store.getState())).toBe(true);
    expect(selectCompletedCourseKeys(store.getState())).toContain("C1");
    expect(store.getState().placeCourse("C1", "monday", "T1")).toBeNull();
    expect(store.getState()).toMatchObject({
      selectedCourseKey: "C1",
      selectedSessionNumber: 2,
      selectedOccurrenceId: placed[3]!.id,
      isPanelOpen: true,
    });

    store.getState().updateSessionProfessor("C1", 1, null);
    expect(selectIsCourseComplete("C1")(store.getState())).toBe(false);
    expect(selectCompletedCourseKeys(store.getState())).not.toContain("C1");

    store.getState().updateSessionProfessor("C1", 1, "P1");
    expect(selectIsCourseComplete("C1")(store.getState())).toBe(true);
    store.getState().updateOccurrence(placed[0]!.id, { classroomId: null });
    expect(selectIsCourseComplete("C1")(store.getState())).toBe(false);
    expect(selectCompletedCourseKeys(store.getState())).not.toContain("C1");

    store.getState().updateOccurrence(placed[0]!.id, { classroomId: "R1" });
    expect(selectIsCourseComplete("C1")(store.getState())).toBe(true);
    expect(store.getState().removeOccurrence(placed[0]!.id)).toBe(true);
    expect(selectIsCourseComplete("C1")(store.getState())).toBe(false);
    expect(selectCompletedCourseKeys(store.getState())).not.toContain("C1");
    const replacement = store.getState().placeCourse("C1", "monday", "T1");
    expect(replacement).toMatchObject({ id: placed[0]!.id, sessionNumber: 1 });
  });

  it("moves and inserts cards immutably within and between cells", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("IT", "202660");
    store.getState().hydrate(makeData());
    const first = store.getState().placeCourse("C1", "monday", "T1")!;
    const second = store.getState().placeCourse("C1", "monday", "T1")!;
    const third = store.getState().placeCourse("C2", "monday", "T1")!;
    const before = store.getState().courses;

    expect(store.getState().moveOccurrence(third.id, "monday", "T1", 0)).toBe(true);
    const monday = store.getState().courses
      .flatMap(({ sessions }) => sessions.flatMap(({ occurrences }) => occurrences))
      .filter(({ day }) => day === "monday")
      .sort((left, right) => left.position - right.position);
    expect(monday.map(({ id }) => id)).toEqual([third.id, first.id, second.id]);
    expect(store.getState().courses).not.toBe(before);

    expect(store.getState().moveOccurrence(first.id, "tuesday", "T1", 0)).toBe(true);
    expect(occurrenceById(store, first.id)).toMatchObject({ day: "tuesday", position: 0 });
    expect(occurrenceById(store, third.id)?.position).toBe(0);
    expect(occurrenceById(store, second.id)?.position).toBe(1);
  });

  it("excludes a moving card from target checks and retains invalid edited values as warnings", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("IT", "202660");
    store.getState().hydrate(makeData());
    const placed = store.getState().placeCourse("C2", "monday", "T1")!;
    store.getState().updateSessionProfessor("C2", 1, "P1");
    store.getState().updateOccurrence(placed.id, { classroomId: "R1" });

    expect(store.getState().getTargetConflicts("C2", "monday", "T1", placed.id)).toEqual([]);
    expect(store.getState().moveOccurrence(placed.id, "monday", "T1", 0)).toBe(true);
    expect(occurrenceById(store, placed.id)?.conflictCodes).toEqual([]);
    store.getState().updateSessionCapacity("C2", 1, -10);
    expect(occurrenceById(store, placed.id)?.conflictCodes).toEqual([]);

    store.getState().updateSessionProfessor("C2", 1, "missing-professor");
    store.getState().updateOccurrence(placed.id, {
      day: "tuesday",
      classroomId: "missing-classroom",
    });

    const course = store.getState().courses.find(({ courseKey }) => courseKey === "C2")!;
    expect(course.sessions[0]).toMatchObject({ professorId: "missing-professor", capacity: -10 });
    expect(occurrenceById(store, placed.id)).toMatchObject({
      day: "tuesday",
      classroomId: "missing-classroom",
      conflictCodes: expect.arrayContaining(["professor_not_capable", "classroom_not_found"]),
    });
  });

  it("supports course/session switching and selection, panel, and context clearing APIs", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("IT", "202660");
    store.getState().hydrate(makeData());
    const placed = store.getState().placeCourse("C1", "monday", "T1")!;

    store.getState().selectSession("C1", 2);
    expect(store.getState()).toMatchObject({
      selectedCourseKey: "C1",
      selectedSessionNumber: 2,
      selectedOccurrenceId: null,
    });
    store.getState().selectOccurrence(placed.id);
    store.getState().openContextMenu(placed.id);
    expect(store.getState()).toMatchObject({
      selectedOccurrenceId: placed.id,
      isPanelOpen: true,
      contextMenuTarget: { occurrenceId: placed.id },
    });
    store.getState().closeContextMenu();
    store.getState().closePanel();
    expect(store.getState()).toMatchObject({ isPanelOpen: false, contextMenuTarget: null });
    store.getState().selectCourse("C2");
    expect(store.getState()).toMatchObject({
      selectedCourseKey: "C2",
      selectedSessionNumber: 1,
      selectedOccurrenceId: null,
    });
    store.getState().clearSelection();
    expect(store.getState()).toMatchObject({
      selectedCourseKey: null,
      selectedSessionNumber: null,
      selectedOccurrenceId: null,
      isPanelOpen: false,
    });
  });
});
