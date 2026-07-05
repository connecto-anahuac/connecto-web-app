// src/infrastructure/local/repositories/course.repository.ts

import { db } from "../databse";// src/infrastructure/local/repositories/pre-requisito.repository.ts
import { PreRequisitoEntity } from "../entities";

export class PreRequisitoRepository {
  async UpsertBulk(prerequisitos: PreRequisitoEntity[]) : Promise<void> {
    try {
  
      console.log("writing-prerequisitos");
  
      await db.transaction(
        "rw",
        db.preRequisitos,
        async () => {
          if (prerequisitos.length) await db.preRequisitos.bulkPut(prerequisitos );
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

  async save(
    prerequisito: PreRequisitoEntity,
  ): Promise<void> {
    await db.preRequisitos.put(prerequisito);
  }

  async saveMany(
    prerequisitos: PreRequisitoEntity[],
  ): Promise<void> {
    await db.preRequisitos.bulkPut(
      prerequisitos,
    );
  }

  async findAll(): Promise<
    PreRequisitoEntity[]
  > {
    return db.preRequisitos.toArray();
  }

  async findByCourse(
    courseId: string,
  ): Promise<PreRequisitoEntity[]> {
    return db.preRequisitos
      .where("currentCourseKey")
      .equals(courseId)
      .toArray();
  }

  async findRequiredFor(
    courseId: string,
  ): Promise<string[]> {
    const rows =
      await db.preRequisitos
        .where("currentCourseKey")
        .equals(courseId)
        .toArray();

    return rows.map(
      (x) => x.preCourseKey,
    );
  }

  async delete(
    currentCourseKey: string,
    preCourseKey: string,
  ): Promise<void> {
    await db.preRequisitos.delete([
      currentCourseKey,
      preCourseKey,
    ]);
  }

  async clear(): Promise<void> {
    await db.preRequisitos.clear();
  }
}