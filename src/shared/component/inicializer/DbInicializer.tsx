"use client";

import { useEffect, useState } from "react";
import { universityDb } from "@/external/client/university-db";
import {
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

export default function DbInicializer() {
  const [status, setStatus] = useState<string>("idle");

  useEffect(() => {
    let mounted = true;

    async function seed() {
      try {
        if (mounted) setStatus("checking");

        await universityDb.open();
        console.log("inicialized UniversityDB correctly");

        // Courses
        if (mounted) setStatus("fetching-Courses");
        const coursesRes = await fetch(MATERIAS_URL);
        const coursesJson = (await coursesRes.json()) as MateriaSource[];

        const courses: CourseRecord[] = (coursesJson || [])
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

        // plans
        if (mounted) setStatus("fetching-plans");
        const plansRes = await fetch(PLANS_URL);
        const plansJson = (await plansRes.json()) as PlanSource[];

        const plans: PlanRecord[] = (plansJson || [])
          .filter((plan) => plan?.clave?.raw)
          .map((plan, idx: number) => ({
            id: `${String(plan.clave?.raw)}_${idx}`,
            name: "plan 2020",
            career: "TIND",
            courseKey: String(plan.clave?.raw),
            semester: plan.semester != null ? Number(plan.semester) : 0,
            position: plan.position != null ? Number(plan.position) : 0,
          }));

        // preRequisitos: from coursesJson.pre_requisito
        const prereqs: PreRequisitoRecord[] = [];
        (coursesJson || []).forEach((materia) => {
          const current = materia.clave?.raw;
          if (!current) return;
          const preRequisitos = Array.isArray(materia.pre_requisito) ? materia.pre_requisito : [];
          preRequisitos.forEach((prerequisito, i: number) => {
            const preRaw = prerequisito.raw;
            if (!preRaw) return;
            prereqs.push({
              id: `${String(current)}_${String(preRaw)}_${i}`,
              currentCourseKey: String(current),
              preCourseKey: String(preRaw),
            });
          });
        });

        await universityDb.transaction(
          "rw",
          universityDb.students,
          universityDb.grades,
          universityDb.courses,
          universityDb.plans,
          universityDb.preRequisitos,
          async () => {
            if (courses.length) await universityDb.courses.bulkPut(courses);

            if (plans.length) await universityDb.plans.bulkPut(plans);

            if (prereqs.length) await universityDb.preRequisitos.bulkPut(prereqs);
          },
        );
        if (mounted) setStatus("done");
      } catch (error) {
        // keep simple error handling for dev initializer
        console.error("=====DB initializer error:", error);
        if (mounted) setStatus("error");
      }
    }

    seed();

    return () => {
      mounted = false;
    };
  }, []);

  // Hidden UI element that lets devs know seeding status in the DOM.
  return <div style={{ display: "none" }} data-db-seed-status={status} />;
}
