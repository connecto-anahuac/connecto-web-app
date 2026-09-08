"use client";
import type { CourseCollectionDto } from "@/external/dto/course/course.dto";
import { initializeUniversityDataClient } from "@/external/handler/data/initialize.client";
import { getCoursesService } from "@/external/service/di";
export async function fetchCourseCollection(): Promise<CourseCollectionDto[]> { await initializeUniversityDataClient(); return getCoursesService.execute(); }
export const fetchClasses = fetchCourseCollection;

