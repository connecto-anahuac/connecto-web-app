// src/infrastructure/local/repositories/student.repository.ts

import { db } from "../databse";
import { StudentEntity } from "../entities";

export class StudentRepository {

  
  async UpsertBulk(students: StudentEntity[]) : Promise<void> {
    try {
  
      console.log("writing-students");
  
      await db.transaction(
        "rw",
        db.students,
        async () => {
          if (students.length) await db.students.bulkPut(students );
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
  
  async save(student: StudentEntity): Promise<void> {
    await db.students.put(student);
  }

  async saveMany(
    students: StudentEntity[],
  ): Promise<void> {
    await db.students.bulkPut(students);
  }

  async findById(
    id: string,
  ): Promise<StudentEntity | undefined> {
    return db.students.get(id);
  }

  async findAll(): Promise<StudentEntity[]> {
    return db.students.toArray();
  }

  async findByStatus(
    status: string,
  ): Promise<StudentEntity[]> {
    return db.students
      .where("status")
      .equals(status)
      .toArray();
  }

  async findByInitialPeriod(
    period: string,
  ): Promise<StudentEntity[]> {
    return db.students
      .where("enrolledPeriod")
      .equals(period)
      .toArray();
  }

  async delete(id: string): Promise<void> {
    await db.students.delete(id);
  }

  async clear(): Promise<void> {
    await db.students.clear();
  }

  async count(): Promise<number> {
    return db.students.count();
  }
}