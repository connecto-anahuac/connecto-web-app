import { universityDb } from "@/external/client/university-db";
import { StudentRecord } from "@/external/domain/university";
import { Student } from "../domain/student";
import { RecordtoStudent } from "../client/mapper";

export class StudentRepository {
  // async upsertBulk(students: StudentRecord[]): Promise<void> {
  //   try {
  //     await universityDb.transaction("rw", universityDb.students, async () => {
  //       if (students.length) {
  //         await universityDb.students.bulkPut(students);
  //       }
  //     });
  //   } catch (error) {
  //     console.error("DB initializer error:", error);
  //   }
  // }

  // async save(student: StudentRecord): Promise<void> {
  //   await universityDb.students.put(student);
  // }

  // async saveMany(students: StudentRecord[]): Promise<void> {
  //   await universityDb.students.bulkPut(students);
  // }

  async findById(id: string): Promise<Student | undefined> {
    const studentRecord = await universityDb.students.get(id);
    return studentRecord ? RecordtoStudent(studentRecord) : undefined;
  }

  async findAll(): Promise<Student[]> {
    const studentRecords = await universityDb.students.toArray();
    return studentRecords.map(RecordtoStudent);
  }

  async findByCareer(career: string): Promise<Student[]> {
    const studentRecords = await universityDb.students.where("career").equals(career).toArray();
    return studentRecords.map(RecordtoStudent);
  }


  async findByStatus(status: string): Promise<Student[]> {
    const studentRecords = await universityDb.students.where("status").equals(status).toArray();
    return studentRecords.map(RecordtoStudent);
  }

  async findByInitialPeriod(period: string): Promise<Student[]> {
    const studentRecords = await universityDb.students.where("enrolledPeriod").equals(period).toArray();
    return studentRecords.map(RecordtoStudent);
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