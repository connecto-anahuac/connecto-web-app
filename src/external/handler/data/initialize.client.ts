"use client";

import type { InitializeUniversityDataDto } from "@/external/dto/data/initialize-university-data.dto";
import { initializeUniversityData } from "@/external/service/data/initialize-university-data";

export async function initializeUniversityDataClient(): Promise<InitializeUniversityDataDto> {
  return initializeUniversityData();
}
