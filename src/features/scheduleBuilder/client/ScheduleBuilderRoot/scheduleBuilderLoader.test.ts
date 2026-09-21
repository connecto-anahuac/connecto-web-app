import { describe, expect, it } from "vitest";

import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";
import { createScheduleBuilderLoader } from "./scheduleBuilderLoader";

const data = (career: string, period: string): ScheduleBuilderDataDto => ({
  career,
  period,
  offeringCourses: [],
  professors: [],
  classrooms: [],
  timeSlots: [],
});

describe("createScheduleBuilderLoader", () => {
  it("returns only the latest career/period response", async () => {
    const resolvers: Array<(value: ScheduleBuilderDataDto) => void> = [];
    const loader = createScheduleBuilderLoader(() =>
      new Promise((resolve) => resolvers.push(resolve)));

    const stale = loader.load("OLD", "2025");
    const latest = loader.load("NEW", "2026");
    resolvers[1]!(data("NEW", "2026"));
    resolvers[0]!(data("OLD", "2025"));

    await expect(latest).resolves.toEqual({ status: "success", data: data("NEW", "2026") });
    await expect(stale).resolves.toBeNull();
  });
});
