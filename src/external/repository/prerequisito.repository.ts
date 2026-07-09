import { universityDb } from "@/external/client/university-db";
import { PreRequisitoRecord } from "@/external/domain/university";

export class PreRequisitoRepository {
  async upsertBulk(prerequisitos: PreRequisitoRecord[]): Promise<void> {
    try {
      await universityDb.transaction("rw", universityDb.preRequisitos, async () => {
        if (prerequisitos.length) {
          await universityDb.preRequisitos.bulkPut(prerequisitos);
        }
      });
    } catch (error) {
      console.error("DB initializer error:", error);
    }
  }

  async save(prerequisito: PreRequisitoRecord): Promise<void> {
    await universityDb.preRequisitos.put(prerequisito);
  }

  async saveMany(prerequisitos: PreRequisitoRecord[]): Promise<void> {
    await universityDb.preRequisitos.bulkPut(prerequisitos);
  }

  async findAll(): Promise<PreRequisitoRecord[]> {
    return universityDb.preRequisitos.toArray();
  }

  async findByCourse(courseKey: string): Promise<PreRequisitoRecord[]> {
    return universityDb.preRequisitos.where("currentCourseKey").equals(courseKey).toArray();
  }

  async findRequiredFor(courseKey: string): Promise<string[]> {
    const rows = await universityDb.preRequisitos.where("currentCourseKey").equals(courseKey).toArray();
    return rows.map((row) => row.preCourseKey);
  }

  async clear(): Promise<void> {
    await universityDb.preRequisitos.clear();
  }
}