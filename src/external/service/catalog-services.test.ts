import { describe, expect, it } from "vitest";
import { GetCoursesService } from "./course/get-courses.service";
import { GetProfessorsService } from "./professor/get-professors.service";
import { GetStudyPlansService } from "./study-plan/get-study-plans.service";

describe("catalog services", () => {
  it("joins courses and multiple prerequisites from bulk reads", async () => {
    const courses = { findAll: async () => [
      { key: "A", keyCode: "A", keyNumber: "1", name: "Álgebra", hours: 3, credits: 4, block: "B" },
      { key: "B", keyCode: "B", keyNumber: "2", name: "Cálculo", hours: 3, credits: 4, block: "B" },
      { key: "C", keyCode: "C", keyNumber: "3", name: "Física", hours: 3, credits: 4, block: "B" },
    ] };
    const prerequisites = { findAll: async () => [
      { id: "1", currentCourseKey: "C", preCourseKey: "A" },
      { id: "2", currentCourseKey: "C", preCourseKey: "B" },
    ] };
    const rows = await new GetCoursesService(courses as never, prerequisites as never).execute();
    expect(rows.find((row) => row.key === "C")?.prerequisito).toBe("Álgebra, Cálculo");
  });

  it("aggregates a professor by period and returns availability for every day and slot", async () => {
    const professors = {
      findAll: async () => [{ id: "P", name: "Ana", status: "active", career: "TIND", job: "Profesora", email1: "", email2: "", phone: "" }],
      findCapabilities: async () => [{ id: "c1", professorId: "P", period: "202520", courseId: "A" }, { id: "c2", professorId: "P", period: "202520", courseId: "A" }],
      findAssignments: async () => [{ id: "a1", professorId: "P", period: "202520", courseId: "A", timeSlotId: "T1", classroomId: "R" }],
      findAvailabilities: async () => [{ id: "v1", professorId: "P", period: "202520", day: "monday", timeSlotId: "T1", isAvailable: true }, { id: "v2", professorId: "P", period: "202520", day: "tuesday", timeSlotId: "T1", isAvailable: false }],
    };
    const courses = { findAll: async () => [{ key: "A", name: "Álgebra" }] };
    const classrooms = { findAll: async () => [{ id: "R", name: "Aula" }] };
    const slots = { findAll: async () => Array.from({ length: 10 }, (_, index) => ({ id: `T${index + 1}`, startTime: `${String(7 + index).padStart(2, "0")}:00`, endTime: index === 0 ? "08:30" : `${String(8 + index).padStart(2, "0")}:00`, position: index + 1 })) };
    const detail = await new GetProfessorsService(professors as never, courses as never, classrooms as never, slots as never).detail("P");
    expect(detail).toMatchObject({ period: "202520", assignableSubjects: 1, assigned: 1, assignedHours: 1.5 });
    expect(detail?.availability).toHaveLength(70);
    expect(detail?.availability.slice(0, 3)).toMatchObject([{ day: "monday", timeSlotId: "T1", submissionStatus: "available" }, { day: "monday", timeSlotId: "T2", submissionStatus: "unsubmitted" }, { day: "monday", timeSlotId: "T3", submissionStatus: "unsubmitted" }]);
    expect(detail?.availability.find((row) => row.day === "tuesday" && row.timeSlotId === "T1")).toMatchObject({ submissionStatus: "unavailable", isAvailable: false });
  });

  it("joins study-plan relations to course data", async () => {
    const service = new GetStudyPlansService(
      { findById: async () => ({ id: "SP", name: "Plan", career: "TIND", firstPeriod: "", admin: "" }) } as never,
      { findAll: async () => [{ id: "R", name: "Plan", career: "TIND", planId: "SP", courseKey: "A", semester: 2, position: 1 }] } as never,
      { findAll: async () => [{ key: "A", keyCode: "MAT", keyNumber: "1", name: "Álgebra", hours: 3, credits: 4, block: "" }] } as never,
    );
    await expect(service.detail("SP")).resolves.toMatchObject({ courses: [{ courseKey: "A", name: "Álgebra", semester: 2 }] });
  });
});
