// src/infrastructure/local/repositories/materia.repository.ts

import { db } from "../databse";
import { MateriaEntity } from "../entities";


// export class MateriaRepository {
//   async save(materia: Materia): Promise<void> {
//     await db.materias.put(materia);
//   }

//   async saveMany(materias: Materia[]): Promise<void> {
//     await db.materias.bulkPut(materias);
//   }

//   async findById(id: string): Promise<Materia | undefined> {
//     return db.materias.get(id);
//   }

//   async findAll(): Promise<Materia[]> {
//     return db.materias.orderBy("position").toArray();
//   }

//   async findBySemester(
//     semester: number,
//   ): Promise<Materia[]> {
//     return db.materias
//       .where("semester")
//       .equals(semester)
//       .sortBy("position");
//   }

//   async findByBlock(
//     block: string,
//   ): Promise<Materia[]> {
//     return db.materias
//       .where("block")
//       .equals(block)
//       .toArray();
//   }

//   async delete(id: string): Promise<void> {
//     await db.materias.delete(id);
//   }

//   async clear(): Promise<void> {
//     await db.materias.clear();
//   }

//   async count(): Promise<number> {
//     return db.materias.count();
//   }
// }


export class MateriaRepository {
  
    async UpsertBulk(materias: MateriaEntity[]) : Promise<void> {
      try {
    
        console.log("writing-materias");
    
        await db.transaction(
          "rw",
          db.materias,
          async () => {
            if (materias.length) await db.materias.bulkPut(materias );
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
    
  async findAll(): Promise<MateriaEntity[]> {
    return db.materias.orderBy("keyCode").toArray();
  }

  async findById(id: string) {
    return db.materias.get(id);
  }

  async findByBlock(block: string) {
    return db.materias
      .where("block")
      .equals(block)
      .toArray();
  }

  async findByKeyCode(keyCode: string) {
    return db.materias
      .where("keyCode")
      .equals(keyCode)
      .toArray();
  }

  async save(materia: MateriaEntity) {
    await db.materias.put(materia);
  }

  async saveMany(materias: MateriaEntity[]) {
    await db.materias.bulkPut(materias);
  }

  async delete(id: string) {
    await db.materias.delete(id);
  }
}