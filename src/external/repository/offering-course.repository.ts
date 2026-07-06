import { universityDb } from "@/external/client/university-db";
import { OfferingCourseEntity } from "@/external/domain/university";

export class OfferingCourseRepository {
  async upsertBulk(offeringCourses: OfferingCourseEntity[]): Promise<void> {
    try {
      await universityDb.transaction("rw", universityDb.offeringCourses, async () => {
        if (offeringCourses.length) {
          await universityDb.offeringCourses.bulkPut(offeringCourses);
        }
      });
    } catch (error) {
      console.error("DB initializer error:", error);
    }
  }

  async findAll(): Promise<OfferingCourseEntity[]> {
    return universityDb.offeringCourses.toArray();
  }

  async findById(id: string): Promise<OfferingCourseEntity | undefined> {
    return universityDb.offeringCourses.get(id);
  }

  async findByCareer(career: string): Promise<OfferingCourseEntity[]> {
    return universityDb.offeringCourses.where("career").equals(career).toArray();
  }

  async findByPeriod(period: string): Promise<OfferingCourseEntity[]> {
    return universityDb.offeringCourses.where("period").equals(period).toArray();
  }

  async findByCareerAndPeriod(career: string, period: string): Promise<OfferingCourseEntity[]> {
    return universityDb.offeringCourses.where("[career+period]").equals([career, period]).toArray();
  }

  async save(offeringCourse: OfferingCourseEntity): Promise<void> {
    await universityDb.offeringCourses.put(offeringCourse);
  }

  async saveMany(offeringCourses: OfferingCourseEntity[]): Promise<void> {
    await universityDb.offeringCourses.bulkPut(offeringCourses);
  }

  async delete(id: string): Promise<void> {
    await universityDb.offeringCourses.delete(id);
  }

  async deleteByCareerAndPeriod(career: string, period: string): Promise<void> {
    const scopedRows = await this.findByCareerAndPeriod(career, period);
    await universityDb.offeringCourses.bulkDelete(scopedRows.map((row) => row.id));
  }

  async clear(): Promise<void> {
    await universityDb.offeringCourses.clear();
  }
}