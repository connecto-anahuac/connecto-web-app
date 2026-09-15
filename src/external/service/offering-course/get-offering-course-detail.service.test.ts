import { describe, expect, it, vi } from "vitest";
import { GetOfferingCourseDetailService } from "./get-offering-course-detail.service";

describe("GetOfferingCourseDetailService", () => {
  it("groups active career students and separates transitive prerequisite failures", async () => {
    const service = new GetOfferingCourseDetailService(
      { findByCourseKey: async () => [{ id: "r1", name: "Plan A", career: "C", planId: "p1", courseKey: "target", semester: 4, position: 1 }] } as never,
      { findAll: async () => [{ id: "p1", name: "Plan A", career: "C", firstPeriod: "", admin: "" }] } as never,
      { findById: async () => ({ key: "target", keyCode: "A", keyNumber: "1", name: "Target", hours: 3, credits: 3, block: "" }) } as never,
      { findAll: async () => [
        { id: "ready", name: "Ready", status: " Activo ", career: "C", currentSemester: 4, avatarColorRef: 1 },
        { id: "missing", name: "Missing", status: "active", career: "C", currentSemester: 5, avatarColorRef: 2 },
        { id: "passed", name: "Passed", status: "active", career: "C", currentSemester: 5, avatarColorRef: 3 },
        { id: "old", name: "Old", status: "active", career: "C", currentSemester: 3, avatarColorRef: 4 },
      ] } as never,
      { findStudentGrades: async (studentId: string) => ({
        ready: [{ courseKey: "prerequisite", grade: 6 }, { courseKey: "foundation", grade: 6 }],
        missing: [],
        passed: [{ courseKey: "target", grade: 8 }],
        old: [{ courseKey: "prerequisite", grade: 7 }],
      })[studentId] ?? [] } as never,
      { findRequiredFor: async (courseKey: string) => ({ target: ["prerequisite"], prerequisite: ["foundation"], foundation: [] })[courseKey] ?? [] } as never,
      { findById: vi.fn(async () => ({ enabledStudentIdsByStudyPlan: { p1: ["ready", "ready"] }, sessionNumber: 2 })) } as never,
    );

    const detail = await service.execute("C", "target", "202710");

    expect(detail?.enabledStudentIdsByStudyPlan).toEqual({ p1: ["ready"] });
    expect(detail?.estimatedNumber).toBe(1);
    expect(detail?.sessionNumber).toBe(2);
    expect(detail?.studyPlans[0].semesters).toEqual([
      { semester: 5, eligibleStudents: [], studentsWithoutPrerequisites: [{ id: "missing", name: "Missing", avatarColorRef: 2 }] },
      { semester: 4, eligibleStudents: [{ id: "ready", name: "Ready", avatarColorRef: 1 }], studentsWithoutPrerequisites: [] },
      { semester: 3, eligibleStudents: [], studentsWithoutPrerequisites: [{ id: "old", name: "Old", avatarColorRef: 4 }] },
    ]);
  });

  it("restores enabled IDs for legacy selections and totals unique students across study plans", async () => {
    const offerings = { findById: vi.fn(async () => ({ estimatedNumber: 99, sessionNumber: 2 })) };
    const service = new GetOfferingCourseDetailService(
      { findByCourseKey: async () => [
        { id: "a", name: "Plan A", career: "C", planId: "p1", courseKey: "target", semester: 2, position: 1 },
        { id: "b", name: "Plan B", career: "C", planId: "p2", courseKey: "target", semester: 3, position: 1 },
      ] } as never,
      { findAll: async () => [
        { id: "p1", name: "Plan A", career: "C", firstPeriod: "", admin: "" },
        { id: "p2", name: "Plan B", career: "C", firstPeriod: "", admin: "" },
      ] } as never,
      { findById: async () => ({ key: "target", keyCode: "A", keyNumber: "1", name: "Target", hours: 3, credits: 3, block: "" }) } as never,
      { findAll: async () => [
        { id: "one", name: "One", status: "active", career: "C", currentSemester: 3, avatarColorRef: 1 },
        { id: "two", name: "Two", status: "active", career: "C", currentSemester: 2, avatarColorRef: 2 },
      ] } as never,
      { findStudentGrades: async () => [] } as never,
      { findRequiredFor: async () => [] } as never,
      // No enabled ID field: this is a record written by the aggregate-only implementation.
      offerings as never,
    );

    const detail = await service.execute("C", "target", "202740");

    expect(offerings.findById).toHaveBeenCalledWith("C:202740:target");
    expect(detail?.enabledStudentIdsByStudyPlan).toEqual({
      p1: ["one", "two"],
      p2: ["one"],
    });
    expect(detail?.estimatedNumber).toBe(3);
  });
});
