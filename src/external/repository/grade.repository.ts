import { universityDb } from "@/external/client/university-db";
import { GradeRecord } from "@/external/domain/university";

export class GradeRepository {
  async upsertBulk(grades: GradeRecord[]): Promise<void> {
    try {
      await universityDb.transaction("rw", universityDb.grades, async () => {
        if (grades.length) {
          await universityDb.grades.bulkPut(grades);
        }
      });
    } catch (error) {
      console.error("DB initializer error:", error);
    }
  }

  async save(grade: GradeRecord): Promise<void> {
    await universityDb.grades.put(grade);
  }

  async saveMany(grades: GradeRecord[]): Promise<void> {
    await universityDb.grades.bulkPut(grades);
  }

  async findAll(): Promise<GradeRecord[]> {
    return universityDb.grades.toArray();
  }

  async findStudentGrades(studentId: string): Promise<GradeRecord[]> {
    return universityDb.grades.where("studentId").equals(studentId).toArray();
  }

  async findCourseGrades(courseKey: string): Promise<GradeRecord[]> {
    return universityDb.grades.where("courseKey").equals(courseKey).toArray();
  }

  async findByPeriod(period: string): Promise<GradeRecord[]> {
    return universityDb.grades.where("period").equals(period).toArray();
  }

  async findGrade(studentId: string, courseKey: string): Promise<GradeRecord | undefined> {
    return universityDb.grades
      .where("studentId")
      .equals(studentId)
      .and((grade: GradeRecord) => grade.courseKey === courseKey)
      .first();
  }

  async clear(): Promise<void> {
    await universityDb.grades.clear();
  }

  async count(): Promise<number> {
    return universityDb.grades.count();
  }
}