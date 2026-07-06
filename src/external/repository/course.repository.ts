import { universityDb } from "@/external/client/university-db";
import { CourseEntity } from "@/external/domain/university";

export class CourseRepository {
  async upsertBulk(courses: CourseEntity[]): Promise<void> {
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

  async findAll(): Promise<CourseEntity[]> {
    return universityDb.courses.orderBy("keyCode").toArray();
  }

  async findById(id: string): Promise<CourseEntity | undefined> {
    return universityDb.courses.get(id);
  }

  async findByBlock(block: string): Promise<CourseEntity[]> {
    return universityDb.courses.where("block").equals(block).toArray();
  }

  async findByKeyCode(keyCode: string): Promise<CourseEntity[]> {
    return universityDb.courses.where("keyCode").equals(keyCode).toArray();
  }

  async save(course: CourseEntity): Promise<void> {
    await universityDb.courses.put(course);
  }

  async saveMany(courses: CourseEntity[]): Promise<void> {
    await universityDb.courses.bulkPut(courses);
  }

  async delete(id: string): Promise<void> {
    await universityDb.courses.delete(id);
  }
}