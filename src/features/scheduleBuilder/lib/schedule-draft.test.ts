import { describe, expect, it } from "vitest";

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

describe("schedule draft", () => {
  it("calculates required weekly occurrences and disables non-positive hours", () => {
    expect(getRequiredOccurrenceCount(3.1)).toBe(3);
    expect(getRequiredOccurrenceCount(3)).toBe(2);
    expect(getRequiredOccurrenceCount(0)).toBe(0);
    expect(getRequiredOccurrenceCount(-1)).toBe(0);
  });

  it("fills the lowest incomplete session, completes, and resumes after deletion", () => {
    let course = createScheduleCourseDraft(source);
    for (let index = 0; index < 4; index += 1) {
      const placed = placeNextOccurrence(course, { day: "monday", timeSlotId: `T${index + 1}` });
      expect(placed).toBeDefined();
      course = placed!.course;
    }

    expect(course.sessions.map(({ occurrences }) => occurrences.length)).toEqual([2, 2]);
    expect(isScheduleCourseComplete(course)).toBe(true);
    expect(placeNextOccurrence(course, { day: "tuesday", timeSlotId: "T1" })).toBeUndefined();

    const removedId = createOccurrenceId("C1", 1, 1);
    course = removeScheduleOccurrence(course, removedId);
    const replaced = placeNextOccurrence(course, { day: "tuesday", timeSlotId: "T1" });
    expect(replaced?.occurrence.id).toBe(removedId);
    expect(replaced?.occurrence.sessionNumber).toBe(1);
  });
});
