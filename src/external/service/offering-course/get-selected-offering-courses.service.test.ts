import { describe, expect, it, vi } from "vitest";
import { GetSelectedOfferingCoursesService } from "./get-selected-offering-courses.service";

describe("GetSelectedOfferingCoursesService", () => {
  it("lists selections using the requested career and period", async () => {
    const rows = [{ id: "C:202740:course" }];
    const repository = {
      findByCareerAndPeriod: vi.fn(async () => rows),
    };
    const service = new GetSelectedOfferingCoursesService(repository as never);

    await expect(service.execute("C", "202740")).resolves.toBe(rows);
    expect(repository.findByCareerAndPeriod).toHaveBeenCalledWith("C", "202740");
  });
});
