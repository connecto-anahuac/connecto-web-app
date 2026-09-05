import { describe, expect, it, vi } from "vitest";
import type { GradeRecord, PlanRecord } from "@/external/domain/university";
import { Student } from "@/external/domain/student";
import { GetStudentCollectionSummariesService } from "./get-student-collection-summaries.service";

describe("GetStudentCollectionSummariesService", () => {
  it("uses one bulk read per repository and scopes summary metrics to the student's career", async () => {
    const studentRepository = {
      findAll: vi.fn().mockResolvedValue([
        student("ada", "Industrial"),
        student("lin", "Civil"),
        student("no-plan", "Architecture"),
      ]),
    };
    const gradeRepository = {
      findAll: vi.fn().mockResolvedValue([
        grade("ada", "industrial-pass", 8),
        grade("ada", "industrial-fail", 5),
        grade("ada", "industrial-ungraded", -1),
        grade("ada", "civil-pass", 10),
        grade("lin", "civil-pass", 7),
      ]),
    };
    const planRepository = {
      findAll: vi.fn().mockResolvedValue([
        plan("Industrial", "industrial-pass"),
        plan("Industrial", "industrial-fail"),
        plan("Industrial", "industrial-ungraded"),
        plan("Civil", "civil-pass"),
      ]),
    };
    const service = new GetStudentCollectionSummariesService(
      studentRepository as never,
      gradeRepository as never,
      planRepository as never,
    );

    await expect(service.execute()).resolves.toEqual([
      expect.objectContaining({ id: "ada", classProgress: 33, failedClassCount: 1 }),
      expect.objectContaining({ id: "lin", classProgress: 100, failedClassCount: 0 }),
      expect.objectContaining({ id: "no-plan", classProgress: 0, failedClassCount: 0 }),
    ]);
    expect(studentRepository.findAll).toHaveBeenCalledOnce();
    expect(gradeRepository.findAll).toHaveBeenCalledOnce();
    expect(planRepository.findAll).toHaveBeenCalledOnce();
  });

  it("retains the first grade for duplicate student/course records", async () => {
    const service = new GetStudentCollectionSummariesService(
      { findAll: vi.fn().mockResolvedValue([student("ada", "Industrial")]) } as never,
      {
        findAll: vi.fn().mockResolvedValue([
          grade("ada", "math", 5),
          grade("ada", "math", 9),
        ]),
      } as never,
      { findAll: vi.fn().mockResolvedValue([plan("Industrial", "math")]) } as never,
    );

    await expect(service.execute()).resolves.toEqual([
      expect.objectContaining({ classProgress: 0, failedClassCount: 1 }),
    ]);
  });

  it("does not treat the not-found grade sentinel as a failed class", async () => {
    const service = new GetStudentCollectionSummariesService(
      { findAll: vi.fn().mockResolvedValue([student("ada", "Industrial")]) } as never,
      { findAll: vi.fn().mockResolvedValue([grade("ada", "math", -1)]) } as never,
      { findAll: vi.fn().mockResolvedValue([plan("Industrial", "math")]) } as never,
    );

    await expect(service.execute()).resolves.toEqual([
      expect.objectContaining({ classProgress: 0, failedClassCount: 0 }),
    ]);
  });
});

function student(id: string, career: string): Student {
  return new Student({
    id,
    name: id,
    status: "active",
    career,
    enrolledPeriod: "202460",
    regularSemestersCount: 3,
    summerSemestersCount: 0,
    avatarColorRef: 0,
    failCount: 0,
  });
}

function grade(studentId: string, courseKey: string, value: number): GradeRecord {
  return {
    studentId,
    courseKey,
    grade: value,
    period: "202460",
    value: null,
    as: "default",
  };
}

function plan(career: string, courseKey: string): PlanRecord {
  return {
    id: `${career}-${courseKey}`,
    name: courseKey,
    career,
    courseKey,
    semester: 1,
    position: 1,
  };
}
