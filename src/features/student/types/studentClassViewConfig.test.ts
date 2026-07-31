import { describe, expect, it } from "vitest";
import { STUDENT_GRADE_VIEW_CONFIG } from "./studentClassViewConfig";
import type { StudentGradeItem } from "./studentGrade.type";

const item = {
  block: "A",
  credits: 8,
  grade: 9,
  hours: 4,
  id: "course-1",
  keyCode: "MAT",
  keyNumber: "101",
  name: "Álgebra",
  period: null,
  position: 1,
  preRequisites: [{ name: "Fundamentos" }],
  semester: 1,
  status: "passed",
} as unknown as StudentGradeItem;

describe("STUDENT_CLASS_VIEW_CONFIG", () => {
  it("excludes internal id and position columns", () => {
    const ids = STUDENT_GRADE_VIEW_CONFIG.columns.map((column) => column.id);

    expect(ids).not.toContain("id");
    expect(ids).not.toContain("position");
  });

  it("formats prerequisite names and status labels for list consumers", () => {
    const prerequisites = STUDENT_GRADE_VIEW_CONFIG.columns.find(
      (column) => column.id === "preRequisites",
    );
    const status = STUDENT_GRADE_VIEW_CONFIG.columns.find(
      (column) => column.id === "status",
    );

    expect(prerequisites?.format(item)).toBe("Fundamentos");
    expect(status?.format(item)).toBe("Aprobado");
  });
});
