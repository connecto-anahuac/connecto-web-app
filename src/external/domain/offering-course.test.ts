import { describe, expect, it } from "vitest";
import { createOfferingCourseSelectionId } from "./offering-course";

describe("createOfferingCourseSelectionId", () => {
  it("uses career, period, and course key as the selection identity", () => {
    expect(createOfferingCourseSelectionId("career", "202740", "course"))
      .toBe("career:202740:course");
  });

  it("preserves the legacy ID format for period 202660", () => {
    expect(createOfferingCourseSelectionId("career", "202660", "course"))
      .toBe("career:202660:course");
  });
});
