import { db } from "../databse";
import { OfferingCourseEntity } from "../entities";

export class OfferingCourseRepository {
  async UpsertBulk(offeringCourses: OfferingCourseEntity[]): Promise<void> {
    try {
      console.log("writing-offeringCourses");

      await db.transaction("rw", db.offeringCourses, async () => {
        if (offeringCourses.length) {
          await db.offeringCourses.bulkPut(offeringCourses);
        }
      });

      console.log("done");
    } catch (err) {
      console.error("DB initializer error:", err);
      console.log("error");
    }
  }

  async findAll(): Promise<OfferingCourseEntity[]> {
    return db.offeringCourses.toArray();
  }

  async findById(id: string): Promise<OfferingCourseEntity | undefined> {
    return db.offeringCourses.get(id);
  }

  async findByCareer(career: string): Promise<OfferingCourseEntity[]> {
    return db.offeringCourses.where("career").equals(career).toArray();
  }

  async findByPeriod(period: string): Promise<OfferingCourseEntity[]> {
    return db.offeringCourses.where("period").equals(period).toArray();
  }

  async findByCareerAndPeriod(
    career: string,
    period: string,
  ): Promise<OfferingCourseEntity[]> {
    return db.offeringCourses.where("[career+period]").equals([career, period]).toArray();
  }

  async save(offeringCourse: OfferingCourseEntity): Promise<void> {
    await db.offeringCourses.put(offeringCourse);
  }

  async saveMany(offeringCourses: OfferingCourseEntity[]): Promise<void> {
    await db.offeringCourses.bulkPut(offeringCourses);
  }

  async delete(id: string): Promise<void> {
    await db.offeringCourses.delete(id);
  }

  async deleteByCareerAndPeriod(career: string, period: string): Promise<void> {
    const scopedRows = await this.findByCareerAndPeriod(career, period);
    await db.offeringCourses.bulkDelete(scopedRows.map((row) => row.id));
  }

  async clear(): Promise<void> {
    await db.offeringCourses.clear();
  }
}