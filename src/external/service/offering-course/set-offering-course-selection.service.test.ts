import { describe, expect, it, vi } from "vitest";
import { SetOfferingCourseSelectionService } from "./set-offering-course-selection.service";

describe("SetOfferingCourseSelectionService", () => {
  it("persists enabled IDs and the sum of each study plan's unique estimate", async () => {
    const repository = { delete: vi.fn(), save: vi.fn() };
    const service = new SetOfferingCourseSelectionService(repository as never);

    await service.execute({
      career: "C",
      courseKey: "course",
      isSelected: true,
      sessionNumber: 2,
      enabledStudentIdsByStudyPlan: { p1: ["one", "one"], p2: ["one", "two"] },
    });

    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
      sessionNumber: 2,
      estimatedNumber: 3,
      enabledStudentIdsByStudyPlan: { p1: ["one"], p2: ["one", "two"] },
    }));
  });
});
