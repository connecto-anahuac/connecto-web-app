import { beforeEach, describe, expect, it, vi } from "vitest";

const { initializeUniversityDataClient, execute } = vi.hoisted(() => ({
  initializeUniversityDataClient: vi.fn(async () => undefined),
  execute: vi.fn(),
}));

vi.mock("@/external/handler/data/initialize.client", () => ({
  initializeUniversityDataClient,
}));
vi.mock("@/external/service/di", () => ({
  getScheduleBuilderDataService: { execute },
}));

import { fetchScheduleBuilderData } from "./query.client";

const response = {
  career: "IT",
  period: "2026",
  offeringCourses: [],
  professors: [],
  classrooms: [],
  timeSlots: [],
};

describe("fetchScheduleBuilderData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    execute.mockResolvedValue(response);
  });

  it("initializes client data before executing the service", async () => {
    await expect(fetchScheduleBuilderData("IT", "2026")).resolves.toEqual(response);

    expect(initializeUniversityDataClient).toHaveBeenCalledOnce();
    expect(execute).toHaveBeenCalledWith("IT", "2026");
    expect(initializeUniversityDataClient.mock.invocationCallOrder[0])
      .toBeLessThan(execute.mock.invocationCallOrder[0]);
  });
});
