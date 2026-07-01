// src/infrastructure/local/database.ts

import Dexie, { Table } from "dexie";
import { GradeEntity, MateriaEntity, PlanEntity, PreRequisitoEntity, StudentEntity } from "./entities";


export class UniversityDB extends Dexie {
    materias!: Table<MateriaEntity>;
    plans!: Table<PlanEntity>;
  students!: Table<StudentEntity>;
  grades!: Table<GradeEntity>;
  preRequisitos!: Table<PreRequisitoEntity>;

  constructor() {
    super("UniversityDB");

    this.version(1).stores({
      materias:
        "key,keyCode,keyNumber,name",
        // "id,keyCode,keyNumber,hours,credits,block,name",
      
      plans:
        "id,name,materiaKey,career,semester,position",
        // "id,name,materiaKey,career,semester,position",

      students:
        "id,name,status",
        // "id,name,status,initialPeriod",

      grades:
        "++id,studentId,materiaKey,period,grade",
        // "id,studentId,materiaId,period,grade",

      preRequisitos:
        "++id,currentMateriaKey,preMateriaKey",
    });
  }
}

export const db = new UniversityDB();