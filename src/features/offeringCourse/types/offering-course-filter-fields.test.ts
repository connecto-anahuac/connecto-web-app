import { describe, expect, it } from "vitest";
import type { OfferingCourse } from "./offering-course";
import {
  OFFERING_COURSE_FILTER_KEYS,
  OFFERING_COURSE_VIEW_CONFIG,
} from "./offering-course-filter-fields";

const course: OfferingCourse = {
  key: "course-1",
  keyCode: "MAT",
  keyNumber: "101",
  hours: 4,
  credits: 8,
  block: "Básico",
  name: "Álgebra",
  semester: 1,
  position: 2,
  preRequisites: ["Introducción", "Geometría"],
  estimatedNumber: 24,
};

describe("OFFERING_COURSE_VIEW_CONFIG", () => {
  it("defines the ScheduleBuilder table fields in the intended order", () => {
    expect(OFFERING_COURSE_VIEW_CONFIG.fields.map((field) => field.fieldId)).toEqual([
      OFFERING_COURSE_FILTER_KEYS.key,
      OFFERING_COURSE_FILTER_KEYS.hours,
      OFFERING_COURSE_FILTER_KEYS.credits,
      OFFERING_COURSE_FILTER_KEYS.block,
      OFFERING_COURSE_FILTER_KEYS.name,
      OFFERING_COURSE_FILTER_KEYS.semester,
      OFFERING_COURSE_FILTER_KEYS.preRequisites,
      OFFERING_COURSE_FILTER_KEYS.estimatedNumber,
    ]);
  });

  it("formats course identifiers, prerequisites, and the derived estimate for table display", () => {
    const fields = Object.fromEntries(
      OFFERING_COURSE_VIEW_CONFIG.fields.map((field) => [field.fieldId, field]),
    );

    expect(fields.key?.format(course)).toBe("MAT101");
    expect(fields.preRequisites?.format(course)).toBe("Introducción, Geometría");
    expect(fields.estimatedNumber?.format(course)).toBe("24");
    expect(fields.key?.dynamicOption).toBe(true);
    expect(fields.block?.dynamicOption).toBe(true);
  });
});
