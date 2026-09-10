"use client";
import type { ClassroomCollectionDto, ClassroomDetailDto } from "@/external/dto/classroom/classroom.dto";
import { initializeUniversityDataClient } from "@/external/handler/data/initialize.client";
import { getClassroomsService } from "@/external/service/di";
export async function fetchClassroomCollection(): Promise<ClassroomCollectionDto[]> { await initializeUniversityDataClient(); return getClassroomsService.execute(); }
export async function fetchClassroomDetail(id: string): Promise<ClassroomDetailDto | undefined> { await initializeUniversityDataClient(); return getClassroomsService.detail(id); }
export const fetchClassrooms = fetchClassroomCollection;
export const fetchClassroom = fetchClassroomDetail;

