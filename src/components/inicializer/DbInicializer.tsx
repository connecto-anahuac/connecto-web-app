"use client";

import { useEffect, useState } from "react";
import { db } from "../../infra/local/databse";
import {
  CourseEntity,
  PlanEntity,
  PreRequisitoEntity,
} from "@/infra/local/entities";

const STUDENTS_URL = "/dev_untrack/data/students.json";
const CAPP_URL = "/dev_untrack/data/capp_student_data.json";
const MATERIAS_URL = "/dev_untrack/data/materias/Materias_ingenierias.json";
const PLANS_URL = "/dev_untrack/data/materias/Materias_TIND.json";

export default function DbInicializer() {
  const [status, setStatus] = useState<string>("idle");

  useEffect(() => {
    let mounted = true;

    async function seed() {
      try {
        if (mounted) setStatus("checking");

        await db.open();
        console.log("inicialized UniversityDB correctly");

        // Courses
        if (mounted) setStatus("fetching-Courses");
        const CoursesRes = await fetch(MATERIAS_URL);
        const CoursesJson = await CoursesRes.json();

        const courses: CourseEntity[] = (CoursesJson || [])
          .filter((m: any) => m && m.clave && m.clave.raw)
          .map((m: any) => ({
            key: String(m.clave.raw),
            keyCode: String(m.clave.code ?? ""),
            keyNumber: String(m.clave.number ?? ""),
            hours: typeof m.horas === "number" ? m.horas : null,
            credits: typeof m.creditos === "number" ? m.creditos : null,
            block: m.bloque ?? "",
            name: m.materia ?? "",
          }));

        // plans
        if (mounted) setStatus("fetching-plans");
        const plansRes = await fetch(PLANS_URL);
        const plansJson = await plansRes.json();

        const plans: PlanEntity[] = (plansJson || [])
          .filter((p: any) => p && p.clave && p.clave.raw)
          .map((p: any, idx: number) => ({
            id: `${String(p.clave.raw)}_${idx}`,
            name: "plan 2020",
            career: "TIND",
            courseKey: String(p.clave.raw),
            semester: p.semester != null ? Number(p.semester) : null,
            position: p.position != null ? Number(p.position) : null,
          }));

        // preRequisitos: from CoursesJson.pre_requisito
        const prereqs: PreRequisitoEntity[] = [];
        (CoursesJson || []).forEach((m: any) => {
          const current = m?.clave?.raw;
          if (!current) return;
          const pres = Array.isArray(m.pre_requisito) ? m.pre_requisito : [];
          pres.forEach((pr: any, i: number) => {
            const preRaw = pr?.raw;
            if (!preRaw) return;
            prereqs.push({
              id: `${String(current)}_${String(preRaw)}_${i}`,
              currentCourseKey: String(current),
              preCourseKey: String(preRaw),
            });
          });
        });

        await db.transaction(
          "rw",
          db.students,
          db.grades,
          db.courses,
          db.plans,
          db.preRequisitos,
          async () => {
            if (courses.length) await db.courses.bulkPut(courses);

            if (plans.length) await db.plans.bulkPut(plans);

            if (prereqs.length) await db.preRequisitos.bulkPut(prereqs);
          },
        );
        if (mounted) setStatus("done");
      } catch (err) {
        // keep simple error handling for dev initializer
        // eslint-disable-next-line no-console
        console.error("=====DB initializer error:", err);
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
