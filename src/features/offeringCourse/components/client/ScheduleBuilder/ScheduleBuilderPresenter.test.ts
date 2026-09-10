import { describe, expect, it } from "vitest";
import { getEnabledStudentTotal } from "./ScheduleBuilderPresenter";

describe("getEnabledStudentTotal", () => {
  it("deduplicates students within each study plan only", () => {
    expect(
      getEnabledStudentTotal({
        planA: ["student-1", "student-1", "student-2"],
        planB: ["student-1", "student-3"],
      }),
    ).toBe(4);
  });
});
