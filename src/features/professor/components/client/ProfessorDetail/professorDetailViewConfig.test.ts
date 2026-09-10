import { describe, expect, it } from "vitest";
import { AVAILABILITY_VIEW_CONFIG, getProfessorAvailabilityRowId } from "./professorDetailViewConfig";

describe("professor availability view", () => {
  const field = AVAILABILITY_VIEW_CONFIG.fields.find((item) => item.fieldId === "isAvailable")!;
  const dayField = AVAILABILITY_VIEW_CONFIG.fields.find((item) => item.fieldId === "day")!;
  const base = {
    day: "monday" as const,
    timeSlotId: "T1",
    startTime: "07:00",
    endTime: "08:30",
    position: 1,
    submissionStatus: "available" as const,
    isAvailable: true,
  };

  it("displays weekdays in Spanish", () => {
    expect(dayField.format(base)).toBe("Lunes");
    expect(dayField.format({ ...base, day: "sunday" })).toBe("Domingo");
  });

  it("uses the weekday with the time slot for unique row IDs", () => {
    expect(getProfessorAvailabilityRowId(base)).toBe("monday-T1");
    expect(getProfessorAvailabilityRowId({ ...base, day: "tuesday" })).toBe("tuesday-T1");
  });

  it("distinguishes unavailable from unsubmitted", () => {
    expect(field.format({ ...base, submissionStatus: "unavailable", isAvailable: false })).toBe("No");
    expect(field.format({ ...base, submissionStatus: "unsubmitted", isAvailable: null })).toBe("--");
  });
});
