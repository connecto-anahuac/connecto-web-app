"use client";

import {
  ensureScheduleBuilderDataDto,
  type ScheduleBuilderDataDto,
} from "@/external/dto/schedule-builder";
import { initializeUniversityDataClient } from "@/external/handler/data/initialize.client";
import { getScheduleBuilderDataService } from "@/external/service/di";

export async function fetchScheduleBuilderData(
  career: string,
  period: string,
): Promise<ScheduleBuilderDataDto> {
  await initializeUniversityDataClient();
  const data = await getScheduleBuilderDataService.execute(career, period);
  return ensureScheduleBuilderDataDto(data);
}
