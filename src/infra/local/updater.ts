"use client";

import { CAPP_META_COLUMNS } from "./consts";
import { db } from "./databse";
import {
  GradeEntity,
  CourseEntity,
  OfferingCourseEntity,
  PlanEntity,
  PreRequisitoEntity,
  StudentEntity,
} from "./entities";

const STUDENTS_URL = "/dev_untrack/data/students.json";
const CAPP_URL = "/dev_untrack/data/capp_student_data.json";
const MATERIAS_URL = "/dev_untrack/data/materias/Materias_ingenierias.json";
const PLANS_URL = "/dev_untrack/data/materias/Materias_TIND.json";

const NULL_DATA = "--";

type Prop = {
  students?: StudentEntity[];
  grades?: GradeEntity[];
  plans?: PlanEntity[];
  courses?: CourseEntity[];
  preRequisitos?: PreRequisitoEntity[];
  offeringCourses?: OfferingCourseEntity[];
};

export async function upsertWholeBulk({
  students,
  grades,
  plans,
  courses,
  preRequisitos,
  offeringCourses,
}: Prop) {
  try {

    console.log("writing-students");

    await db.transaction(
      "rw",
      [
        db.students,
        db.grades,
        db.plans,
        db.courses,
        db.preRequisitos,
        db.offeringCourses,
      ],
      async () => {
        // students
        if (students&&students.length) await db.students.bulkPut(students );

        // grades
        console.log("fetching-grades");
        if (grades && grades.length) await db.grades.bulkPut(grades);
        
        // courses
        console.log("fetching-courses");
        if (courses && courses.length) await db.courses.bulkPut(courses);

        // plans
        console.log("fetching-plans");
        if (plans && plans.length) await db.plans.bulkPut(plans);

        // preRequisitos
        console.log("fetching-preRequisitos");
        if (preRequisitos && preRequisitos.length) await db.preRequisitos.bulkPut(preRequisitos);

        // offeringCourses
        console.log("fetching-offeringCourses");
        if (offeringCourses && offeringCourses.length) {
          await db.offeringCourses.bulkPut(offeringCourses);
        }

        
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