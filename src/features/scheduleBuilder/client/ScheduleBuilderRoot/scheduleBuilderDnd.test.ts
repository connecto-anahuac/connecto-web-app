import { describe, expect, it } from "vitest";
import type { ScheduleCourseDraft } from "../../types";
import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";
import { createScheduleBuilderStore } from "../scheduleBuilderStore";
import {
  applyScheduleBuilderDrop,
  courseDragId,
  OFFERING_COURSE_DROP_ID,
  occurrenceDragId,
  parseDragSource,
  resolveDropTarget,
  scheduleCellDropId,
} from "./scheduleBuilderDnd";

const courses: ScheduleCourseDraft[] = [{
  id: "o1",
  courseKey: "C1",
  name: "Course",
  hours: 3,
  recommendedSemesters: [1],
  sessions: [{
    sessionNumber: 1,
    professorId: null,
    capacity: 15,
    requiredOccurrenceCount: 2,
    occurrences: [{
      id: "occ-1",
      courseKey: "C1",
      sessionNumber: 1,
      occurrenceNumber: 1,
      day: "monday",
      timeSlotId: "T1",
      classroomId: null,
      position: 2,
      conflictCodes: [],
    }],
  }],
}];

describe("scheduleBuilderDnd", () => {
  it("distinguishes copy and move drag sources", () => {
    expect(parseDragSource(courseDragId("C1"))).toEqual({ kind: "course", courseKey: "C1" });
    expect(parseDragSource(occurrenceDragId("occ-1"))).toEqual({ kind: "occurrence", occurrenceId: "occ-1" });
  });

  it("resolves cell, occurrence insertion, and return targets", () => {
    expect(resolveDropTarget(scheduleCellDropId("tuesday:T2"), courses)).toMatchObject({
      kind: "cell", day: "tuesday", timeSlotId: "T2",
    });
    expect(resolveDropTarget(occurrenceDragId("occ-1"), courses)).toMatchObject({
      kind: "cell", day: "monday", timeSlotId: "T1", position: 2,
    });
    expect(resolveDropTarget(OFFERING_COURSE_DROP_ID, courses)).toEqual({ kind: "offering-course-list" });
  });

  it("copies, moves, reorders, inserts, returns, and keeps the panel selection", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("IT", "2026");
    store.getState().hydrate(data);

    expect(applyScheduleBuilderDrop(store.getState(), { kind: "course", courseKey: "C1" }, {
      kind: "cell", cellId: "monday:T1", day: "monday", timeSlotId: "T1",
    })).toBe(true);
    const firstId = store.getState().selectedOccurrenceId!;
    expect(store.getState().isPanelOpen).toBe(true);

    applyScheduleBuilderDrop(store.getState(), { kind: "course", courseKey: "C2" }, {
      kind: "cell", cellId: "monday:T1", day: "monday", timeSlotId: "T1", position: 0,
    });
    const secondId = store.getState().selectedOccurrenceId!;
    expect(cellOccurrenceIds(store.getState().courses, "monday", "T1")).toEqual([secondId, firstId]);

    applyScheduleBuilderDrop(store.getState(), { kind: "occurrence", occurrenceId: firstId }, {
      kind: "cell", cellId: "monday:T1", day: "monday", timeSlotId: "T1", position: 0,
    });
    expect(cellOccurrenceIds(store.getState().courses, "monday", "T1")).toEqual([firstId, secondId]);

    applyScheduleBuilderDrop(store.getState(), { kind: "occurrence", occurrenceId: firstId }, {
      kind: "cell", cellId: "tuesday:T2", day: "tuesday", timeSlotId: "T2",
    });
    expect(store.getState().selectedOccurrenceId).toBe(firstId);
    expect(store.getState().isPanelOpen).toBe(true);
    expect(cellOccurrenceIds(store.getState().courses, "tuesday", "T2")).toEqual([firstId]);

    expect(applyScheduleBuilderDrop(store.getState(), {
      kind: "occurrence", occurrenceId: firstId,
    }, { kind: "offering-course-list" })).toBe(true);
    expect(cellOccurrenceIds(store.getState().courses, "tuesday", "T2")).toEqual([]);
  });
});

const data: ScheduleBuilderDataDto = {
  career: "IT",
  period: "2026",
  offeringCourses: ["C1", "C2"].map((courseKey) => ({
    id: `offering-${courseKey}`,
    courseKey,
    sessionNumber: 1,
    estimatedNumber: 20,
    course: {
      key: courseKey,
      keyCode: courseKey,
      keyNumber: "1",
      name: courseKey,
      hours: 3,
      credits: 4,
      block: "A",
      recommendedSemesters: [1],
    },
  })),
  professors: [],
  classrooms: [],
  timeSlots: [
    { id: "T1", startTime: "08:00", endTime: "09:30", position: 1 },
    { id: "T2", startTime: "09:30", endTime: "11:00", position: 2 },
  ],
};

function cellOccurrenceIds(
  source: readonly ScheduleCourseDraft[],
  day: "monday" | "tuesday",
  timeSlotId: string,
) {
  return source.flatMap(({ sessions }) => sessions.flatMap(({ occurrences }) => occurrences))
    .filter((occurrence) => occurrence.day === day && occurrence.timeSlotId === timeSlotId)
    .sort((left, right) => left.position - right.position)
    .map(({ id }) => id);
}
