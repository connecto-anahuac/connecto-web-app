"use client";

import type { InitializeUniversityDataDto } from "@/external/dto/data/initialize-university-data.dto";
import { universityDb } from "@/external/client/university-db";
import type {
  CourseRecord,
  PlanRecord,
  PreRequisitoRecord,
} from "@/external/domain/university";

const MATERIAS_URL = "/dev_untrack/data/materias/Materias_ingenierias.json";
const PLANS_URL = "/dev_untrack/data/materias/Materias_TIND.json";

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
};

type PlanSource = {
  clave?: {
    raw?: string;
  };
  semester?: number;
  position?: number;
};

let initializationPromise: Promise<InitializeUniversityDataDto> | undefined;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load seed data from ${url}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function toCourses(materias: MateriaSource[]): CourseRecord[] {
  return materias
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
}

function toPreRequisitos(materias: MateriaSource[]): PreRequisitoRecord[] {
  const prerequisitos: PreRequisitoRecord[] = [];

  materias.forEach((materia) => {
    const currentCourseKey = materia.clave?.raw;
    if (!currentCourseKey) return;

    const requirements = Array.isArray(materia.pre_requisito)
      ? materia.pre_requisito
      : [];

    requirements.forEach((prerequisito, index) => {
      if (!prerequisito.raw) return;

      prerequisitos.push({
        id: `${currentCourseKey}_${prerequisito.raw}_${index}`,
        currentCourseKey: String(currentCourseKey),
        preCourseKey: String(prerequisito.raw),
      });
    });
  });

  return prerequisitos;
}

function toPlans(plans: PlanSource[]): PlanRecord[] {
  return plans
    .filter((plan) => plan?.clave?.raw)
    .map((plan, index) => ({
      id: `${String(plan.clave?.raw)}_${index}`,
      name: "plan 2020",
      career: "TIND",
      courseKey: String(plan.clave?.raw),
      semester: plan.semester != null ? Number(plan.semester) : 0,
      position: plan.position != null ? Number(plan.position) : 0,
    }));
}

async function seedUniversityData(): Promise<InitializeUniversityDataDto> {
  await universityDb.open();

  const [coursesCount, plansCount, preRequisitosCount] = await Promise.all([
    universityDb.courses.count(),
    universityDb.plans.count(),
    universityDb.preRequisitos.count(),
  ]);

  const coursesMissing = coursesCount === 0;
  const plansMissing = plansCount === 0;
  const preRequisitosMissing = preRequisitosCount === 0;

  if (!coursesMissing && !plansMissing && !preRequisitosMissing) {
    return {
      coursesSeeded: false,
      plansSeeded: false,
      preRequisitosSeeded: false,
    };
  }

  const materias = coursesMissing || preRequisitosMissing
    ? await fetchJson<MateriaSource[]>(MATERIAS_URL)
    : undefined;
  const plans = plansMissing
    ? await fetchJson<PlanSource[]>(PLANS_URL)
    : undefined;

  const tables = [
    ...(coursesMissing ? [universityDb.courses] : []),
    ...(plansMissing ? [universityDb.plans] : []),
    ...(preRequisitosMissing ? [universityDb.preRequisitos] : []),
  ];

  await universityDb.transaction("rw", tables, async () => {
    if (coursesMissing) {
      await universityDb.courses.bulkPut(toCourses(materias ?? []));
    }

    if (plansMissing) {
      await universityDb.plans.bulkPut(toPlans(plans ?? []));
    }

    if (preRequisitosMissing) {
      await universityDb.preRequisitos.bulkPut(toPreRequisitos(materias ?? []));
    }
  });

  return {
    coursesSeeded: coursesMissing,
    plansSeeded: plansMissing,
    preRequisitosSeeded: preRequisitosMissing,
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
