"use client";
import type { ProfessorCollectionDto, ProfessorDetailDto } from "@/external/dto/professor/professor.dto";
import { initializeUniversityDataClient } from "@/external/handler/data/initialize.client";
import { getProfessorsService } from "@/external/service/di";
export async function fetchProfessorCollection(period?: string): Promise<ProfessorCollectionDto[]> { await initializeUniversityDataClient(); return getProfessorsService.execute(period); }
export async function fetchProfessorDetail(id: string, period?: string): Promise<ProfessorDetailDto | undefined> { await initializeUniversityDataClient(); return getProfessorsService.detail(id, period); }
export const fetchProfessors = fetchProfessorCollection;
export const fetchProfessor = fetchProfessorDetail;

