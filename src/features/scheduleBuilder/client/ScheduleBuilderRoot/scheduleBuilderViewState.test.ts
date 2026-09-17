import { describe, expect, it } from "vitest";
import type { ScheduleBuilderProfessor, ScheduleCourseDraft } from "../../types";
import {
  getActiveHighlightCourseKey,
  getAvailableProfessorAvatars,
} from "./scheduleBuilderViewState";

describe("getAvailableProfessorAvatars", () => {
  it("keeps active available professors except those assigned in the same slot", () => {
    const professors: ScheduleBuilderProfessor[] = [
      {
        id: "p1", name: "Ada", status: "active", career: "IT", courseCapabilities: ["C1"],
        availability: [{ day: "monday", timeSlotId: "T1", isAvailable: true }],
      },
      {
        id: "p2", name: "Grace", status: "inactive", career: "IT", courseCapabilities: ["C1"],
        availability: [{ day: "monday", timeSlotId: "T1", isAvailable: true }],
      },
    ];
    const courses: ScheduleCourseDraft[] = [{
      id: "o1", courseKey: "C1", name: "Course", hours: 3, recommendedSemesters: [1],
      sessions: [{
        sessionNumber: 1, professorId: "p1", capacity: 15, requiredOccurrenceCount: 2,
        occurrences: [{
          id: "occ-1", courseKey: "C1", sessionNumber: 1, occurrenceNumber: 1,
          day: "monday", timeSlotId: "T1", classroomId: null, position: 0, conflictCodes: [],
        }],
      }],
    }];

    expect(getAvailableProfessorAvatars(professors, [])).toEqual({
      "monday:T1": [{ id: "p1", fullName: "Ada" }],
    });
    expect(getAvailableProfessorAvatars(professors, courses)).toEqual({});
  });
});

describe("getActiveHighlightCourseKey", () => {
  it("highlights left-card selection and occurrence drag, but not panel occurrence selection", () => {
    const courses: ScheduleCourseDraft[] = [{
      id: "o1", courseKey: "C1", name: "Course", hours: 3, recommendedSemesters: [1],
      sessions: [{
        sessionNumber: 1, professorId: null, capacity: 15, requiredOccurrenceCount: 2,
        occurrences: [{
          id: "occ-1", courseKey: "C1", sessionNumber: 1, occurrenceNumber: 1,
          day: "monday", timeSlotId: "T1", classroomId: null, position: 0, conflictCodes: [],
        }],
      }],
    }];
    expect(getActiveHighlightCourseKey(null, "C1", null, courses)).toBe("C1");
    expect(getActiveHighlightCourseKey(null, "C1", "occ-1", courses)).toBeNull();
    expect(getActiveHighlightCourseKey(
      { kind: "occurrence", occurrenceId: "occ-1" }, "C1", "occ-1", courses,
    )).toBe("C1");
  });
});
