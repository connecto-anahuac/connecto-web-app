import { universityDb } from "@/external/client/university-db";
import { PlanRecord } from "@/external/domain/university";

export class PlanRepository {
  async upsertBulk(plans: PlanRecord[]): Promise<void> {
    try {
      await universityDb.transaction("rw", universityDb.plans, async () => {
        if (plans.length) {
          await universityDb.plans.bulkPut(plans);
        }
      });
    } catch (error) {
      console.error("DB initializer error:", error);
    }
  }

  async findAll(): Promise<PlanRecord[]> {
    return universityDb.plans.orderBy("position").toArray();
  }

  async findById(id: string): Promise<PlanRecord | undefined> {
    return universityDb.plans.get(id);
  }

  async findByCareer(career: string): Promise<PlanRecord[]> {
    return universityDb.plans.where("career").equals(career).toArray();
  }

  async findBySemester(semester: number): Promise<PlanRecord[]> {
    return universityDb.plans.where("semester").equals(semester).sortBy("position");
  }

  async findByCourseKey(courseKey: string): Promise<PlanRecord[]> {
    return universityDb.plans.where("courseKey").equals(courseKey).toArray();
  }

  async findByCareerAndSemester(career: string, semester: number): Promise<PlanRecord[]> {
    return universityDb.plans.where("[career+semester]").equals([career, semester]).toArray();
  }

  async save(plan: PlanRecord): Promise<void> {
    await universityDb.plans.put(plan);
  }

  async saveMany(plans: PlanRecord[]): Promise<void> {
    await universityDb.plans.bulkPut(plans);
  }

  async delete(id: string): Promise<void> {
    await universityDb.plans.delete(id);
  }

  async deleteByCourseKey(courseKey: string): Promise<void> {
    const plans = await universityDb.plans.where("courseKey").equals(courseKey).toArray();
    await universityDb.plans.bulkDelete(plans.map((plan) => plan.id));
  }
}