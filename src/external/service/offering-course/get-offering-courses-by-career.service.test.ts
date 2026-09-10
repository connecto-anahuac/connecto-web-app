import { describe, expect, it } from "vitest";
import { GetOfferingCoursesByCareerService } from "./get-offering-courses-by-career.service";

describe("GetOfferingCoursesByCareerService", () => {
  it("sums each study plan's unique eligible total, including shared students", async () => {
    const service = new GetOfferingCoursesByCareerService(
      { findByCareer: async () => [
        { id: "p1", courseKey: "target", career: "C", name: "Plan A", semester: 2, position: 2, planId: "plan-a" },
        { id: "p2", courseKey: "target", career: "C", name: "Plan B", semester: 3, position: 1, planId: "plan-b" },
      ] } as never,
      { findById: async () => ({ key: "target", keyCode: "A", keyNumber: "1", name: "Target", hours: 3, credits: 3, block: "" }) } as never,
      { findRequiredFor: async (courseKey: string) => ({ target: ["required"], required: [] })[courseKey] ?? [] } as never,
      { findAll: async () => [
        { id: "one", status: "Activo", career: "C", currentSemester: 3 },
        { id: "two", status: "active", career: "C", currentSemester: 2 },
        { id: "early", status: "active", career: "C", currentSemester: 1 },
        { id: "passed", status: "active", career: "C", currentSemester: 4 },
        { id: "other", status: "active", career: "Other", currentSemester: 4 },
      ] } as never,
      { findStudentGrades: async (studentId: string) => ({
        one: [{ courseKey: "required", grade: 7 }],
        two: [{ courseKey: "required", grade: 6 }],
        early: [{ courseKey: "required", grade: 10 }],
        passed: [{ courseKey: "required", grade: 8 }, { courseKey: "target", grade: 8 }],
        other: [{ courseKey: "required", grade: 8 }],
      })[studentId] ?? [] } as never,
    );

    await expect(service.execute("C")).resolves.toEqual([
      expect.objectContaining({ key: "target", estimatedNumber: 3 }),
    ]);
  });
});
