import { describe, expect, it, vi } from "vitest";

import { GetScheduleBuilderDataService } from "./get-schedule-builder-data.service";

describe("GetScheduleBuilderDataService", () => {
  it("joins selected courses with scoped professor data and T1-T10 slots", async () => {
    const service = new GetScheduleBuilderDataService({
      offeringCourses: { findByCareerAndPeriod: vi.fn(async () => [
        { id: "o1", career: "IT", period: "2026", courseKey: "C1", sessionNumber: 2, estimatedNumber: 20 },
        { id: "o2", career: "IT", period: "2026", courseKey: "C2", sessionNumber: 0, estimatedNumber: 10 },
      ]) },
      courses: { findAll: vi.fn(async () => [
        { key: "C1", keyCode: "C", keyNumber: "1", name: "Course", hours: 3, credits: 4, block: "B" },
        { key: "C2", keyCode: "C", keyNumber: "2", name: "Excluded", hours: 3, credits: 4, block: "B" },
      ]) },
      plans: { findByCareer: vi.fn(async () => [
        { id: "p1", name: "Plan", career: "IT", courseKey: "C1", semester: 3, position: 1 },
        { id: "p2", name: "Plan 2", career: "IT", courseKey: "C1", semester: 5, position: 1 },
      ]) },
      professors: {
        findAll: vi.fn(async () => [{ id: "P1", name: "Ada", status: "active", career: "IT", job: "", email1: "", email2: "", phone: "" }]),
        findCapabilities: vi.fn(async () => [
          { id: "cap1", professorId: "P1", period: "2026", courseId: "C1" },
          { id: "cap-old", professorId: "P1", period: "2025", courseId: "C2" },
        ]),
        findAvailabilities: vi.fn(async () => [
          { id: "a1", professorId: "P1", period: "2026", day: "monday" as const, timeSlotId: "T1", isAvailable: true },
          { id: "a-old", professorId: "P1", period: "2025", day: "tuesday" as const, timeSlotId: "T2", isAvailable: true },
        ]),
      },
      classrooms: { findAll: vi.fn(async () => [{ id: "R1", name: "Room", place: "A", note: "", equipments: [], admin: "" }]) },
      timeSlots: { findAll: vi.fn(async () => [
        { id: "T11", startTime: "22:00", endTime: "23:30", position: 11 },
        { id: "T2", startTime: "09:30", endTime: "11:00", position: 2 },
        { id: "T1", startTime: "08:00", endTime: "09:30", position: 1 },
      ]) },
    });

    const result = await service.execute("IT", "2026");

    expect(result.offeringCourses).toHaveLength(1);
    expect(result.offeringCourses[0].course.recommendedSemesters).toEqual([3, 5]);
    expect(result.professors[0].courseCapabilities).toEqual(["C1"]);
    expect(result.professors[0].availability).toEqual([{ day: "monday", timeSlotId: "T1", isAvailable: true }]);
    expect(result.timeSlots.map(({ id }) => id)).toEqual(["T1", "T2"]);
  });
});
