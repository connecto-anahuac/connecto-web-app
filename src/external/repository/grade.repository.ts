import { universityDb } from "@/external/client/university-db";
import { GradeEntity } from "@/external/domain/university";

export class GradeRepository {
  async upsertBulk(grades: GradeEntity[]): Promise<void> {
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

  async save(grade: GradeEntity): Promise<void> {
    await universityDb.grades.put(grade);
  }

  async saveMany(grades: GradeEntity[]): Promise<void> {
    await universityDb.grades.bulkPut(grades);
  }

  async findAll(): Promise<GradeEntity[]> {
    return universityDb.grades.toArray();
  }

  async findStudentGrades(studentId: string): Promise<GradeEntity[]> {
    return universityDb.grades.where("studentId").equals(studentId).toArray();
  }

  async findCourseGrades(courseKey: string): Promise<GradeEntity[]> {
    return universityDb.grades.where("courseKey").equals(courseKey).toArray();
  }

  async findByPeriod(period: string): Promise<GradeEntity[]> {
    return universityDb.grades.where("period").equals(period).toArray();
  }

  async findGrade(studentId: string, courseKey: string): Promise<GradeEntity | undefined> {
    return universityDb.grades
      .where("studentId")
      .equals(studentId)
      .and((grade: GradeEntity) => grade.courseKey === courseKey)
      .first();
  }

  async clear(): Promise<void> {
    await universityDb.grades.clear();
  }

  async count(): Promise<number> {
    return universityDb.grades.count();
  }
}