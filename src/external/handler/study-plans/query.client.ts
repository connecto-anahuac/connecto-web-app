"use client";
import type { StudyPlanCollectionDto, StudyPlanDetailDto } from "@/external/dto/study-plan/study-plan.dto";
import { initializeUniversityDataClient } from "@/external/handler/data/initialize.client";
import { getStudyPlansService } from "@/external/service/di";
export async function fetchStudyPlanCollection(): Promise<StudyPlanCollectionDto[]> { await initializeUniversityDataClient(); return getStudyPlansService.execute(); }
export async function fetchStudyPlanDetail(id: string): Promise<StudyPlanDetailDto | undefined> { await initializeUniversityDataClient(); return getStudyPlansService.detail(id); }
export const fetchStudyPlans = fetchStudyPlanCollection;
export const fetchStudyPlan = fetchStudyPlanDetail;
