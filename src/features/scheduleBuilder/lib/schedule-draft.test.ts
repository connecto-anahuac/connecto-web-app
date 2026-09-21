import { describe, expect, it } from "vitest";

import type { ScheduleCourseDraft, ScheduleWeekDay } from "../types";

import {
  createOccurrenceId,
  createScheduleCourseDraft,
  getRequiredOccurrenceCount,
  isScheduleCourseComplete,
  placeNextOccurrence,
  removeScheduleOccurrence,
} from "./schedule-draft";

const source = {
  id: "offering-1",
  courseKey: "C1",
  sessionNumber: 2,
  estimatedNumber: 30,
  course: { key: "C1", keyCode: "C", keyNumber: "1", name: "Course", hours: 3, credits: 4, block: "B", recommendedSemesters: [3] },
};

const fullyAssignCourse = (course: ScheduleCourseDraft): ScheduleCourseDraft => ({
  ...course,
  sessions: course.sessions.map((session) => ({
    ...session,
    professorId: `P${session.sessionNumber}`,
    occurrences: session.occurrences.map((occurrence) => ({
      ...occurrence,
      classroomId: `R${occurrence.occurrenceNumber}`,
    })),
  })),
});

const placeRequiredOccurrences = (): ScheduleCourseDraft => {
  let course = createScheduleCourseDraft(source);
  for (let index = 0; index < 4; index += 1) {
    const placed = placeNextOccurrence(course, {
      day: index % 2 === 0 ? "monday" : "tuesday",
      timeSlotId: `T${index + 1}`,
    });
    expect(placed).toBeDefined();
    course = placed!.course;
  }
  return course;
};

describe("schedule draft", () => {
  it("calculates required weekly occurrences and disables non-positive hours", () => {
    expect(getRequiredOccurrenceCount(3.1)).toBe(3);
    expect(getRequiredOccurrenceCount(3)).toBe(2);
    expect(getRequiredOccurrenceCount(0)).toBe(0);
    expect(getRequiredOccurrenceCount(-1)).toBe(0);
  });

  it("fills the lowest incomplete session and resumes after deletion", () => {
    let course = placeRequiredOccurrences();

    expect(course.sessions.map(({ occurrences }) => occurrences.length)).toEqual([2, 2]);
    expect(placeNextOccurrence(course, { day: "tuesday", timeSlotId: "T1" })).toBeUndefined();

    const removedId = createOccurrenceId("C1", 1, 1);
    course = removeScheduleOccurrence(course, removedId);
    const replaced = placeNextOccurrence(course, { day: "tuesday", timeSlotId: "T1" });
    expect(replaced?.occurrence.id).toBe(removedId);
    expect(replaced?.occurrence.sessionNumber).toBe(1);
  });

  it("requires assignments in addition to the required occurrences", () => {
    const course = placeRequiredOccurrences();

    expect(isScheduleCourseComplete(course)).toBe(false);
    expect(isScheduleCourseComplete(fullyAssignCourse(course))).toBe(true);
  });

  it.each([
    ["professor", (course: ScheduleCourseDraft) => ({
      ...course,
      sessions: course.sessions.map((session, index) => index === 0
        ? { ...session, professorId: null }
        : session),
    })],
    ["day", (course: ScheduleCourseDraft) => ({
      ...course,
      sessions: course.sessions.map((session, sessionIndex) => sessionIndex === 0
        ? {
            ...session,
            occurrences: session.occurrences.map((occurrence, occurrenceIndex) => occurrenceIndex === 0
              ? { ...occurrence, day: "" as ScheduleWeekDay }
              : occurrence),
          }
        : session),
    })],
    ["time", (course: ScheduleCourseDraft) => ({
      ...course,
      sessions: course.sessions.map((session, sessionIndex) => sessionIndex === 0
        ? {
            ...session,
            occurrences: session.occurrences.map((occurrence, occurrenceIndex) => occurrenceIndex === 0
              ? { ...occurrence, timeSlotId: "" }
              : occurrence),
          }
        : session),
    })],
    ["classroom", (course: ScheduleCourseDraft) => ({
      ...course,
      sessions: course.sessions.map((session, sessionIndex) => sessionIndex === 0
        ? {
            ...session,
            occurrences: session.occurrences.map((occurrence, occurrenceIndex) => occurrenceIndex === 0
              ? { ...occurrence, classroomId: null }
              : occurrence),
          }
        : session),
    })],
  ])("stays incomplete when an occurrence is missing its %s assignment", (_, makeIncomplete) => {
    const complete = fullyAssignCourse(placeRequiredOccurrences());

    expect(isScheduleCourseComplete(makeIncomplete(complete))).toBe(false);
  });

  it("stays incomplete when any occurrence has a conflict", () => {
    const complete = fullyAssignCourse(placeRequiredOccurrences());
    const withConflict: ScheduleCourseDraft = {
      ...complete,
      sessions: complete.sessions.map((session, sessionIndex) => sessionIndex === 0
        ? {
            ...session,
            occurrences: session.occurrences.map((occurrence, occurrenceIndex) => occurrenceIndex === 0
              ? { ...occurrence, conflictCodes: ["classroom_conflict"] }
              : occurrence),
          }
        : session),
    };

    expect(isScheduleCourseComplete(withConflict)).toBe(false);
  });

  it("requires every session to be fully assigned and conflict-free", () => {
    const complete = fullyAssignCourse(placeRequiredOccurrences());
    const oneIncompleteSession: ScheduleCourseDraft = {
      ...complete,
      sessions: complete.sessions.map((session, index) => index === 1
        ? { ...session, professorId: null }
        : session),
    };

    expect(isScheduleCourseComplete(oneIncompleteSession)).toBe(false);
    expect(isScheduleCourseComplete(complete)).toBe(true);
  });
});
