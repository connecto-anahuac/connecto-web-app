"use client";

import { CAPP_META_COLUMNS } from "./consts";
import { db } from "./databse";
import { GradeEntity, MateriaEntity, PlanEntity, PreRequisitoEntity, StudentEntity } from "./entities";

const STUDENTS_URL = "/dev_untrack/data/students.json";
const CAPP_URL = "/dev_untrack/data/capp_student_data.json";
const MATERIAS_URL = "/dev_untrack/data/materias/Materias_ingenierias.json";
const PLANS_URL = "/dev_untrack/data/materias/Materias_TIND.json";

const NULL_DATA = "--";

type Prop = {
  students?: StudentEntity[];
  grades?: GradeEntity[];
  plans?: PlanEntity[];
  materias?: MateriaEntity[];
  preRequisitos?: PreRequisitoEntity[];
}

export async function upsertWholeBulk({ students, grades, plans, materias, preRequisitos }: Prop) {
  try {

    console.log("writing-students");

    await db.transaction(
      "rw",
      db.students,
      db.grades,
      db.plans,
      db.materias,
      db.preRequisitos,
      async () => {
        // students
        if (students&&students.length) await db.students.bulkPut(students );

        // grades
        console.log("fetching-grades");
        if (grades && grades.length) await db.grades.bulkPut(grades);
        
        // materias
        console.log("fetching-materias");
        if (materias && materias.length) await db.materias.bulkPut(materias);

        // plans
        console.log("fetching-plans");
        if (plans && plans.length) await db.plans.bulkPut(plans);

        // preRequisitos
        console.log("fetching-preRequisitos");
        if (preRequisitos && preRequisitos.length) await db.preRequisitos.bulkPut(preRequisitos);

        
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


        // materias
        console.log("fetching-materias");
        const materiasRes = await fetch(MATERIAS_URL);
        const materiasJson = await materiasRes.json();

        const materias: Materia[] = (materiasJson || [])
          .filter((m: any) => m && m.clave && m.clave.raw)
          .map((m: any) => ({
            id: String(m.clave.raw),
            keyCode: String(m.clave.code ?? ""),
            keyNumber: String(m.clave.number ?? ""),
            hours: typeof m.horas === "number" ? m.horas : null,
            credits: typeof m.creditos === "number" ? m.creditos : null,
            block: m.bloque ?? "",
            name: m.materia ?? "",
          }));

        if (materias.length) await db.materias.bulkPut(materias as any);

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
            materiaId: String(p.clave.raw),
            semester: p.semester != null ? Number(p.semester) : null,
            position: p.position != null ? Number(p.position) : null,
          }));

        if (plans.length) await db.plans.bulkPut(plans as any);

        // preRequisitos: from materiasJson.pre_requisito
        const prereqs: PreRequisito[] = [];
        (materiasJson || []).forEach((m: any) => {
          const current = m?.clave?.raw;
          if (!current) return;
          const pres = Array.isArray(m.pre_requisito) ? m.pre_requisito : [];
          pres.forEach((pr: any, i: number) => {
            const preRaw = pr?.raw;
            if (!preRaw) return;
            prereqs.push({
              id: `${String(current)}_${String(preRaw)}_${i}`,
              currentMateriaId: String(current),
              preMateriaId: String(preRaw),
            });
          });
        });

        if (prereqs.length) await db.preRequisitos.bulkPut(prereqs as any);


*/