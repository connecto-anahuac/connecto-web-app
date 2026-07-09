import { universityDb } from "@/external/client/university-db";
import { CourseRecord } from "@/external/domain/university";

export class CourseRepository {
  async upsertBulk(courses: CourseRecord[]): Promise<void> {
    try {
      await universityDb.transaction("rw", universityDb.courses, async () => {
        if (courses.length) {
          await universityDb.courses.bulkPut(courses);
        }
      });
    } catch (error) {
      console.error("DB initializer error:", error);
    }
  }

  async findAll(): Promise<CourseRecord[]> {
    return universityDb.courses.orderBy("keyCode").toArray();
  }

  async findById(id: string): Promise<CourseRecord | undefined> {
    return universityDb.courses.get(id);
  }

  async findByBlock(block: string): Promise<CourseRecord[]> {
    return universityDb.courses.where("block").equals(block).toArray();
  }

  async findByKeyCode(keyCode: string): Promise<CourseRecord[]> {
    return universityDb.courses.where("keyCode").equals(keyCode).toArray();
  }

  async save(course: CourseRecord): Promise<void> {
    await universityDb.courses.put(course);
  }

  async saveMany(courses: CourseRecord[]): Promise<void> {
    await universityDb.courses.bulkPut(courses);
  }

  async delete(id: string): Promise<void> {
    await universityDb.courses.delete(id);
  }
}