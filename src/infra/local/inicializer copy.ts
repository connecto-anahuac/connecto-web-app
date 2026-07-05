"use client";

import { CAPP_META_COLUMNS } from "./consts";
import { db } from "./databse";
import { GradeEntity, CourseEntity, PlanEntity, PreRequisitoEntity, StudentEntity } from "./entities";

const STUDENTS_URL = "/dev_untrack/data/students.json";
const CAPP_URL = "/dev_untrack/data/capp_student_data.json";
const MATERIAS_URL = "/dev_untrack/data/materias/Materias_ingenierias.json";
const PLANS_URL = "/dev_untrack/data/materias/Materias_TIND.json";

const NULL_DATA = "--";

async function seed() {
  try {
    console.log("checking");

    const count = await db.students.count();
    if (count > 0) {
      console.log("already-seeded");
      return;
    }

    console.log("fetching-students");
    const studentsRes = await fetch(STUDENTS_URL);
    const studentsJson = await studentsRes.json();

    const students: StudentEntity[] = (studentsJson || []).map((s: any) => {
      if (!s) return null;
      if (!s[CAPP_META_COLUMNS.id] || s[CAPP_META_COLUMNS.id] === "") return null;
      return {
        id: String(s[CAPP_META_COLUMNS.id] ),
        name: s[CAPP_META_COLUMNS.name] ?? NULL_DATA,
        status: s[CAPP_META_COLUMNS.status] ?? NULL_DATA,
        initialPeriod: String(s[CAPP_META_COLUMNS.period] ?? NULL_DATA),
      };
    });

    console.log("writing-students");

    await db.transaction(
      "rw",
      db.students,
      db.grades,
      async () => {
        if (students.length) await db.students.bulkPut(students );

        // grades
        console.log("fetching-grades");
        const gradesRes = await fetch(CAPP_URL);
        const gradesJson = await gradesRes.json();

        const grades: GradeEntity[] = (gradesJson || []).map(
          (g: any, idx: number) => ({
            id: `${g.student_id ?? ""}_${g.class_code ?? ""}_${g.period ?? ""}_${idx}`,
            studentId: String(g.student_id ?? ""),
            courseId: String(g.class_code ?? ""),
            period: String(g.period ?? ""),
            grade: typeof g.grade === "number" ? g.grade : null,
            as: g.as ?? "",
          }),
        );

        if (grades.length) await db.grades.bulkPut(grades as any);
      },
    );

    console.log("done");
  } catch (err) {
    // keep simple error handling for dev initializer
    // eslint-disable-next-line no-console
    console.error("DB initializer error:", err);
    console.log("error");
  }
}



/* 


        // courses
        console.log("fetching-courses");
        const coursesRes = await fetch(MATERIAS_URL);
        const coursesJson = await coursesRes.json();

        const courses: Course[] = (coursesJson || [])
          .filter((m: any) => m && m.clave && m.clave.raw)
          .map((m: any) => ({
            id: String(m.clave.raw),
            keyCode: String(m.clave.code ?? ""),
            keyNumber: String(m.clave.number ?? ""),
            hours: typeof m.horas === "number" ? m.horas : null,
            credits: typeof m.creditos === "number" ? m.creditos : null,
            block: m.bloque ?? "",
            name: m.course ?? "",
          }));

        if (courses.length) await db.courses.bulkPut(courses as any);

        // plans
        console.log("fetching-plans");
        const plansRes = await fetch(PLANS_URL);
        const plansJson = await plansRes.json();

        const plans: Plan[] = (plansJson || [])
          .filter((p: any) => p && p.clave && p.clave.raw)
          .map((p: any, idx: number) => ({
            id: `${String(p.clave.raw)}_${idx}`,
            name: "plan 2020",
            career: "TIND",
            courseId: String(p.clave.raw),
            semester: p.semester != null ? Number(p.semester) : null,
            position: p.position != null ? Number(p.position) : null,
          }));

        if (plans.length) await db.plans.bulkPut(plans as any);

        // preRequisitos: from coursesJson.pre_requisito
        const prereqs: PreRequisito[] = [];
        (coursesJson || []).forEach((m: any) => {
          const current = m?.clave?.raw;
          if (!current) return;
          const pres = Array.isArray(m.pre_requisito) ? m.pre_requisito : [];
          pres.forEach((pr: any, i: number) => {
            const preRaw = pr?.raw;
            if (!preRaw) return;
            prereqs.push({
              id: `${String(current)}_${String(preRaw)}_${i}`,
              currentCourseId: String(current),
              preCourseId: String(preRaw),
            });
          });
        });

        if (prereqs.length) await db.preRequisitos.bulkPut(prereqs as any);


*/