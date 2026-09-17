import { describe, expect, it } from "vitest";

import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";
import type { ScheduleCourseDraft } from "../types";
import {
  revalidateSchedule,
  validateProfessorForSession,
  validateTargetCell,
} from "./schedule-conflicts";

const data: ScheduleBuilderDataDto = {
  career: "IT",
  period: "2026",
  offeringCourses: [],
  professors: [
    { id: "P1", name: "Ada", status: "active", career: "IT", courseCapabilities: ["C1", "C2"], availability: [{ day: "monday", timeSlotId: "T1", isAvailable: true }] },
    { id: "P2", name: "Grace", status: "active", career: "IT", courseCapabilities: [], availability: [] },
  ],
  classrooms: [{ id: "R1", name: "Room", place: "", note: "", equipments: [], admin: "" }],
  timeSlots: [{ id: "T1", startTime: "08:00", endTime: "09:30", position: 1 }],
};

const courses: ScheduleCourseDraft[] = [
  { id: "o1", courseKey: "C1", name: "One", hours: 1.5, recommendedSemesters: [3], sessions: [{ sessionNumber: 1, professorId: "P1", capacity: 15, requiredOccurrenceCount: 1, occurrences: [{ id: "C1:session-1:occurrence-1", courseKey: "C1", sessionNumber: 1, occurrenceNumber: 1, day: "monday", timeSlotId: "T1", classroomId: "R1", position: 0, conflictCodes: [] }] }] },
  { id: "o2", courseKey: "C2", name: "Two", hours: 1.5, recommendedSemesters: [3], sessions: [{ sessionNumber: 1, professorId: "P1", capacity: 15, requiredOccurrenceCount: 1, occurrences: [{ id: "C2:session-1:occurrence-1", courseKey: "C2", sessionNumber: 1, occurrenceNumber: 1, day: "monday", timeSlotId: "T1", classroomId: "R1", position: 1, conflictCodes: [] }] }] },
];

const singleOccurrenceCourse = (overrides: Partial<ScheduleCourseDraft["sessions"][number]["occurrences"][number]> = {}) => {
  const course = structuredClone(courses[0]);
  course.sessions[0].occurrences[0] = { ...course.sessions[0].occurrences[0], ...overrides };
  return course;
};

describe("schedule conflicts", () => {
  it("detects combined professor, classroom, and recommended semester conflicts", () => {
    const validated = revalidateSchedule(courses, data);
    expect(validated[0].sessions[0].occurrences[0].conflictCodes).toEqual(expect.arrayContaining([
      "professor_conflict",
      "classroom_conflict",
      "recommended_semester_conflict",
    ]));
  });

  it("excludes the occurrence itself while checking a professor candidate", () => {
    expect(validateProfessorForSession("P1", courses[0], courses[0].sessions[0], {
      courses: [courses[0]],
      data,
    })).toEqual([]);
  });

  it("evaluates target cells using the assigned professor and excludes a moving occurrence", () => {
    expect(validateTargetCell({
      course: courses[0],
      session: courses[0].sessions[0],
      day: "monday",
      timeSlotId: "T1",
      occurrenceId: courses[0].sessions[0].occurrences[0].id,
    }, { courses: [courses[0]], data })).toEqual([]);

    expect(validateTargetCell({
      course: courses[0],
      session: courses[0].sessions[0],
      day: "tuesday",
      timeSlotId: "T1",
    }, { courses: [courses[0]], data })).toContain("professor_unavailable");
  });

  it("keeps invalid assignments and returns all applicable warnings", () => {
    const invalid = structuredClone(courses[0]);
    invalid.sessions[0].professorId = "P2";
    invalid.sessions[0].occurrences[0].classroomId = "missing";
    invalid.sessions[0].occurrences[0].day = "tuesday";

    const validated = revalidateSchedule([invalid], data);
    const occurrence = validated[0].sessions[0].occurrences[0];
    expect(occurrence.classroomId).toBe("missing");
    expect(occurrence.conflictCodes).toEqual(expect.arrayContaining([
      "professor_not_capable",
      "professor_unavailable",
      "classroom_not_found",
    ]));
  });

  it("reports professor and classroom assignment requirements independently", () => {
    const course = singleOccurrenceCourse({ classroomId: null });
    course.sessions[0].professorId = null;

    const [validated] = revalidateSchedule([course], data);
    expect(validated.sessions[0].occurrences[0].conflictCodes).toEqual([
      "professor_unassigned",
      "classroom_unassigned",
    ]);
  });

  it("does not report conflicts for an otherwise valid standalone occurrence", () => {
    const [validated] = revalidateSchedule([singleOccurrenceCourse()], data);
    expect(validated.sessions[0].occurrences[0].conflictCodes).toEqual([]);
  });

  it("keeps an inactive professor assignment and warns that it is unavailable", () => {
    const inactiveData = structuredClone(data);
    inactiveData.professors[0].status = "inactive";

    const [validated] = revalidateSchedule([singleOccurrenceCourse()], inactiveData);
    expect(validated.sessions[0].professorId).toBe("P1");
    expect(validated.sessions[0].occurrences[0].conflictCodes).toContain(
      "professor_unavailable",
    );
  });
});
