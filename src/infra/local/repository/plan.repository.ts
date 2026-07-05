import { db } from "../databse";
import { PlanEntity } from "../entities";

export class  PlanRepository {
  async UpsertBulk(plans: PlanEntity[]) : Promise<void> {
    try {
  
      console.log("writing-plans");
  
      await db.transaction(
        "rw",
        db.plans,
        async () => {
          if (plans.length) await db.plans.bulkPut(plans );
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

  async findAll(): Promise<PlanEntity[]> {
    return db.plans.orderBy("position").toArray();
  }

  async findById(id: string) {
    return db.plans.get(id);
  }

  async findByCareer(career: string) {
    return db.plans
      .where("career")
      .equals(career)
      .toArray();
  }

  async findBySemester(semester: number) {
    return db.plans
      .where("semester")
      .equals(semester)
      .sortBy("position");
  }

  async findByCourseKey(courseKey: string) {
    return db.plans
      .where("courseKey")
      .equals(courseKey)
      .toArray();
  }

  async findByCareerAndSemester(
    career: string,
    semester: number
  ) {
    return db.plans
      .where("[career+semester]")
      .equals([career, semester])
      .toArray();
  }

  async save(plan: PlanEntity) {
    await db.plans.put(plan);
  }

  async saveMany(plans: PlanEntity[]) {
    await db.plans.bulkPut(plans);
  }

  async delete(id: string) {
    await db.plans.delete(id);
  }

  async deleteByCourseKey(courseKey: string) {
    const plans = await db.plans
      .where("courseKey")
      .equals(courseKey)
      .toArray();

    await db.plans.bulkDelete(plans.map(p => p.id));
  }
}