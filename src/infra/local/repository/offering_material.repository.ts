import { db } from "../databse";
import { OfferingMaterialEntity } from "../entities";

export class OfferingMaterialRepository {
  async UpsertBulk(offeringMaterials: OfferingMaterialEntity[]): Promise<void> {
    try {
      console.log("writing-offeringMaterials");

      await db.transaction("rw", db.offeringMaterials, async () => {
        if (offeringMaterials.length) {
          await db.offeringMaterials.bulkPut(offeringMaterials);
        }
      });

      console.log("done");
    } catch (err) {
      console.error("DB initializer error:", err);
      console.log("error");
    }
  }

  async findAll(): Promise<OfferingMaterialEntity[]> {
    return db.offeringMaterials.toArray();
  }

  async findById(id: string): Promise<OfferingMaterialEntity | undefined> {
    return db.offeringMaterials.get(id);
  }

  async findByCareer(career: string): Promise<OfferingMaterialEntity[]> {
    return db.offeringMaterials.where("career").equals(career).toArray();
  }

  async findByPeriod(period: string): Promise<OfferingMaterialEntity[]> {
    return db.offeringMaterials.where("period").equals(period).toArray();
  }

  async findByCareerAndPeriod(
    career: string,
    period: string,
  ): Promise<OfferingMaterialEntity[]> {
    return db.offeringMaterials.where("[career+period]").equals([career, period]).toArray();
  }

  async save(offeringMaterial: OfferingMaterialEntity): Promise<void> {
    await db.offeringMaterials.put(offeringMaterial);
  }

  async saveMany(offeringMaterials: OfferingMaterialEntity[]): Promise<void> {
    await db.offeringMaterials.bulkPut(offeringMaterials);
  }

  async delete(id: string): Promise<void> {
    await db.offeringMaterials.delete(id);
  }

  async deleteByCareerAndPeriod(career: string, period: string): Promise<void> {
    const scopedRows = await this.findByCareerAndPeriod(career, period);
    await db.offeringMaterials.bulkDelete(scopedRows.map((row) => row.id));
  }

  async clear(): Promise<void> {
    await db.offeringMaterials.clear();
  }
}