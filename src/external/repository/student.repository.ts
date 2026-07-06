import { universityDb } from "@/external/client/university-db";
import { StudentEntity } from "@/external/domain/university";

export class StudentRepository {
  async upsertBulk(students: StudentEntity[]): Promise<void> {
    try {
      await universityDb.transaction("rw", universityDb.students, async () => {
        if (students.length) {
          await universityDb.students.bulkPut(students);
        }
      });
    } catch (error) {
      console.error("DB initializer error:", error);
    }
  }

  async save(student: StudentEntity): Promise<void> {
    await universityDb.students.put(student);
  }

  async saveMany(students: StudentEntity[]): Promise<void> {
    await universityDb.students.bulkPut(students);
  }

  async findById(id: string): Promise<StudentEntity | undefined> {
    return universityDb.students.get(id);
  }

  async findAll(): Promise<StudentEntity[]> {
    return universityDb.students.toArray();
  }

  async findByStatus(status: string): Promise<StudentEntity[]> {
    return universityDb.students.where("status").equals(status).toArray();
  }

  async findByInitialPeriod(period: string): Promise<StudentEntity[]> {
    return universityDb.students.where("enrolledPeriod").equals(period).toArray();
  }

  async delete(id: string): Promise<void> {
    await universityDb.students.delete(id);
  }

  async clear(): Promise<void> {
    await universityDb.students.clear();
  }

  async count(): Promise<number> {
    return universityDb.students.count();
  }
}