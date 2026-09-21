"use client";

import type { InitializeUniversityDataDto } from "@/external/dto/data/initialize-university-data.dto";
import { universityDb } from "@/external/client/university-db";
import type {
  CourseRecord,
  PlanRecord,
  PreRequisitoRecord,
  StudyPlanRecord,
  TimeSlotRecord,
} from "@/external/domain/university";
import {
  dummyProfessorAvailabilities,
  dummyProfessorCourseCapabilities,
  dummyProfessors,
} from "@/external/dummy/professors";
import { dummyClassrooms } from "@/external/dummy/classrooms";

const DIRECTORY_URL = "/dev_untrack/data/academic-directory.json";
const PLAN_SOURCES = [
  { career: "TIND", url: "/dev_untrack/data/materias/Materias_TIND.json" },
  { career: "Civil", url: "/dev_untrack/data/materias/Materias_INCI.json" },
  { career: "Ambiental", url: "/dev_untrack/data/materias/Materias_IAMB.json" },
  { career: "Industrial", url: "/dev_untrack/data/materias/Materias_INIE.json" },
] as const;

type MateriaSource = {
  clave?: {
    raw?: string;
    code?: string;
    number?: string;
  };
  horas?: number;
  creditos?: number;
  bloque?: string;
  materia?: string;
  pre_requisito?: Array<{
    raw?: string;
  }>;
  semester?: number | string;
  position?: number | string;
};
type DirectorySource = {
  studyPlans: StudyPlanRecord[];
};

export const TIME_SLOTS: TimeSlotRecord[] = Array.from({ length: 10 }, (_, index) => {
  const start = 7 * 60 + index * 90; const end = start + 90;
  const format = (value: number) => `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
  return { id: `T${index + 1}`, startTime: format(start), endTime: format(end), position: index + 1 };
});

let initializationPromise: Promise<InitializeUniversityDataDto> | undefined;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load seed data from ${url}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function toCourses(sources: MateriaSource[][]): CourseRecord[] {
  const courses = sources
    .flat()
    .filter((materia) => materia?.clave?.raw)
    .map((materia) => ({
      key: String(materia.clave?.raw),
      keyCode: String(materia.clave?.code ?? ""),
      keyNumber: String(materia.clave?.number ?? ""),
      hours: typeof materia.horas === "number" ? materia.horas : 0,
      credits: typeof materia.creditos === "number" ? materia.creditos : 0,
      block: materia.bloque ?? "",
      name: materia.materia ?? "",
    }));

  return [...new Map(courses.map((course) => [course.key, course])).values()];
}

function toPreRequisitos(sources: MateriaSource[][]): PreRequisitoRecord[] {
  const prerequisitos = new Map<string, PreRequisitoRecord>();

  sources.flat().forEach((materia) => {
    const currentCourseKey = materia.clave?.raw;
    if (!currentCourseKey) return;

    const requirements = Array.isArray(materia.pre_requisito)
      ? materia.pre_requisito
      : [];

    requirements.forEach((prerequisito) => {
      if (!prerequisito.raw) return;

      const id = `${currentCourseKey}:${prerequisito.raw}`;
      prerequisitos.set(id, {
        id,
        currentCourseKey: String(currentCourseKey),
        preCourseKey: String(prerequisito.raw),
      });
    });
  });

  return [...prerequisitos.values()];
}

function toPlans(plans: MateriaSource[], career: string): PlanRecord[] {
  return plans
    .filter((plan) => plan?.clave?.raw)
    .map((plan) => ({
      id: `${career}:${String(plan.clave?.raw)}`,
      name: career,
      career,
      courseKey: String(plan.clave?.raw),
      semester: plan.semester != null ? Number(plan.semester) : 0,
      position: plan.position != null ? Number(plan.position) : 0,
      planId: career,
    }));
}

async function seedUniversityData(): Promise<InitializeUniversityDataDto> {
  await universityDb.open();

  const [coursesCount, preRequisitosCount, professorsCount, capabilitiesCount, availabilitiesCount, timeSlotsCount, classroomsCount, studyPlansCount] = await Promise.all([
    universityDb.courses.count(),
    universityDb.preRequisitos.count(),
    universityDb.professors.count(), universityDb.professorCourseCapabilities.count(), universityDb.professorAvailabilities.count(), universityDb.timeSlots.count(), universityDb.classrooms.count(), universityDb.studyPlans.count(),
  ]);

  const coursesMissing = coursesCount === 0;
  const missingPlanSources = (
    await Promise.all(
      PLAN_SOURCES.map(async (source) => ({
        source,
        count: await universityDb.plans.where("career").equals(source.career).count(),
      })),
    )
  ).filter(({ count }) => count === 0).map(({ source }) => source);
  const plansMissing = missingPlanSources.length > 0;
  const preRequisitosMissing = preRequisitosCount === 0;

  const professorDataMissing = [professorsCount, capabilitiesCount, availabilitiesCount].some((count) => count === 0);
  const classroomDataMissing = classroomsCount === 0;
  const directoryMissing = studyPlansCount === 0;
  const timeSlotsMissing = timeSlotsCount === 0;
  const shouldLoadDirectory = directoryMissing || plansMissing;
  if (!coursesMissing && !plansMissing && !preRequisitosMissing && !professorDataMissing && !classroomDataMissing && !shouldLoadDirectory && !timeSlotsMissing) {
    return {
      coursesSeeded: false,
      plansSeeded: false,
      preRequisitosSeeded: false,
    };
  }

  const sourcesToLoad = coursesMissing || preRequisitosMissing
    ? [...PLAN_SOURCES]
    : missingPlanSources;
  const sourceData = await Promise.all(
    sourcesToLoad.map(async (source) => ({
      career: source.career,
      records: await fetchJson<MateriaSource[]>(source.url),
    })),
  );
  const missingCareers = new Set(missingPlanSources.map(({ career }) => career));
  const plansToSeed = sourceData
    .filter(({ career }) => missingCareers.has(career))
    .flatMap(({ career, records }) => toPlans(records, career));

  const courseCandidates = toCourses(sourceData.map(({ records }) => records));
  const existingCourses = coursesMissing
    ? []
    : await universityDb.courses.bulkGet(courseCandidates.map(({ key }) => key));
  const coursesToSeed = courseCandidates.filter(
    (_course, index) => coursesMissing || !existingCourses[index],
  );

  const preRequisitoCandidates = toPreRequisitos(
    sourceData.map(({ records }) => records),
  );
  const existingPreRequisitos = preRequisitosMissing
    ? []
    : await universityDb.preRequisitos.bulkGet(
      preRequisitoCandidates.map(({ id }) => id),
    );
  const preRequisitosToSeed = preRequisitoCandidates.filter(
    (_preRequisito, index) => preRequisitosMissing || !existingPreRequisitos[index],
  );

  const directory = shouldLoadDirectory ? await fetchJson<DirectorySource>(DIRECTORY_URL) : undefined;
  const existingStudyPlans = directory
    ? await universityDb.studyPlans.bulkGet(directory.studyPlans.map((studyPlan) => studyPlan.id))
    : [];
  const studyPlansToSeed = directory?.studyPlans.filter(
    (_studyPlan, index) => !existingStudyPlans[index],
  ) ?? [];

  const tables = [
    ...(coursesToSeed.length > 0 ? [universityDb.courses] : []),
    ...(plansToSeed.length > 0 ? [universityDb.plans] : []),
    ...(preRequisitosToSeed.length > 0 ? [universityDb.preRequisitos] : []),
    ...(professorsCount === 0 ? [universityDb.professors] : []),
    ...(capabilitiesCount === 0 ? [universityDb.professorCourseCapabilities] : []),
    ...(availabilitiesCount === 0 ? [universityDb.professorAvailabilities] : []),
    ...(timeSlotsMissing ? [universityDb.timeSlots] : []),
    ...(classroomsCount === 0 ? [universityDb.classrooms] : []),
    ...(studyPlansToSeed.length > 0 ? [universityDb.studyPlans] : []),
  ];

  await universityDb.transaction("rw", tables, async () => {
    if (coursesToSeed.length > 0) {
      await universityDb.courses.bulkPut(coursesToSeed);
    }

    if (plansToSeed.length > 0) {
      await universityDb.plans.bulkPut(plansToSeed);
    }

    if (preRequisitosToSeed.length > 0) {
      await universityDb.preRequisitos.bulkPut(preRequisitosToSeed);
    }
    if (professorsCount === 0) await universityDb.professors.bulkPut(dummyProfessors);
    if (capabilitiesCount === 0) await universityDb.professorCourseCapabilities.bulkPut(dummyProfessorCourseCapabilities);
    if (availabilitiesCount === 0) await universityDb.professorAvailabilities.bulkPut(dummyProfessorAvailabilities);
    if (timeSlotsMissing) await universityDb.timeSlots.bulkPut(TIME_SLOTS);
    if (classroomsCount === 0) await universityDb.classrooms.bulkPut(dummyClassrooms);
    if (studyPlansToSeed.length > 0) await universityDb.studyPlans.bulkPut(studyPlansToSeed);
  });

  return {
    coursesSeeded: coursesToSeed.length > 0,
    plansSeeded: plansToSeed.length > 0,
    preRequisitosSeeded: preRequisitosToSeed.length > 0,
  };
}

/**
 * Seeds the shared university reference data once per browser session.
 * A rejected initialization is deliberately retryable on the next call.
 */
export function initializeUniversityData(): Promise<InitializeUniversityDataDto> {
  if (!initializationPromise) {
    initializationPromise = seedUniversityData().catch((error: unknown) => {
      initializationPromise = undefined;
      throw error;
    });
  }

  return initializationPromise;
}
