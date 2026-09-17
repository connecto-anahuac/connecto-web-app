import { describe, expect, it } from "vitest";
import { toScheduleBuilderOfferingCourse } from "./scheduleBuilderOfferingCourse";

describe("toScheduleBuilderOfferingCourse", () => {
  it("maps only a selected Schedule Builder DTO course to the local list model", () => {
    expect(toScheduleBuilderOfferingCourse({
      id: "offering-1",
      courseKey: "MAT101",
      sessionNumber: 2,
      estimatedNumber: 24,
      course: {
        key: "MAT101",
        keyCode: "MAT",
        keyNumber: "101",
        name: "Matemáticas",
        hours: 3,
        credits: 4,
        block: "A",
        recommendedSemesters: [3, 5],
      },
    })).toMatchObject({
      key: "MAT101",
      keyCode: "MAT",
      keyNumber: "101",
      semester: 3,
      estimatedNumber: 24,
    });
  });
});
