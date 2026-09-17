import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";
import { fetchScheduleBuilderData } from "@/external/handler/schedule-builder/query.client";

export type ScheduleBuilderLoadResult =
  | { status: "success"; data: ScheduleBuilderDataDto }
  | { status: "error"; message: string };

type Fetcher = (career: string, period: string) => Promise<ScheduleBuilderDataDto>;

/** Ensures a slower superseded career/period request can never hydrate the UI. */
export function createScheduleBuilderLoader(fetcher: Fetcher = fetchScheduleBuilderData) {
  let latestRequestId = 0;

  return {
    async load(career: string, period: string): Promise<ScheduleBuilderLoadResult | null> {
      const requestId = ++latestRequestId;
      try {
        const data = await fetcher(career, period);
        if (requestId !== latestRequestId) return null;
        return { status: "success", data };
      } catch {
        if (requestId !== latestRequestId) return null;
        return { status: "error", message: "Failed loading schedule builder data" };
      }
    },
  };
}
