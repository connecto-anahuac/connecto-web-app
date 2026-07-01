// src/infrastructure/local/repositories/materia.repository.ts

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

  async findByMateria(
    materiaId: string,
  ): Promise<PreRequisitoEntity[]> {
    return db.preRequisitos
      .where("currentMateriaKey")
      .equals(materiaId)
      .toArray();
  }

  async findRequiredFor(
    materiaId: string,
  ): Promise<string[]> {
    const rows =
      await db.preRequisitos
        .where("currentMateriaKey")
        .equals(materiaId)
        .toArray();

    return rows.map(
      (x) => x.preMateriaKey,
    );
  }

  async delete(
    currentMateriaKey: string,
    preMateriaKey: string,
  ): Promise<void> {
    await db.preRequisitos.delete([
      currentMateriaKey,
      preMateriaKey,
    ]);
  }

  async clear(): Promise<void> {
    await db.preRequisitos.clear();
  }
}