// src/infrastructure/local/repositories/course.repository.ts

import { db } from "../databse";// src/infrastructure/local/repositories/grade.repository.ts
import { GradeEntity } from "../entities";


export class GradeRepository {

  
    async UpsertBulk(grades: GradeEntity[]) : Promise<void> {
      try {
    
        console.log("writing-grades");
    
        await db.transaction(
          "rw",
          db.grades,
          async () => {
            if (grades.length) await db.grades.bulkPut(grades );
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
    
  async save(
    grade: GradeEntity,
  ): Promise<void> {
    await db.grades.put(grade);
  }

  async saveMany(
    grades: GradeEntity[],
  ): Promise<void> {
    await db.grades.bulkPut(grades);
  }

  async findAll(): Promise<GradeEntity[]> {
    return db.grades.toArray();
  }

  async findStudentGrades(
    studentId: string,
  ): Promise<GradeEntity[]> {
    return db.grades
      .where("studentId")
      .equals(studentId)
      .toArray();
  }

  async findCourseGrades(
    courseKey: string,
  ): Promise<GradeEntity[]> {
    return db.grades
      .where("courseKey")
      .equals(courseKey)
      .toArray();
  }

  async findByPeriod(
    period: string,
  ): Promise<GradeEntity[]> {
    return db.grades
      .where("period")
      .equals(period)
      .toArray();
  }

  async findGrade(
    studentId: string,
    courseId: string,
  ): Promise<GradeEntity | undefined> {
    // grades table uses `id` as primary key; query by studentId + courseId instead
    return db.grades
      .where("studentId")
      .equals(studentId)
      .and((g: GradeEntity) => g.courseKey === courseId)
      .first();
  }

  async delete(
    studentId: string,
    courseId: string,
  ): Promise<void> {
    await db.grades.delete([
      studentId,
      courseId,
    ]);
  }

  async clear(): Promise<void> {
    await db.grades.clear();
  }

  async count(): Promise<number> {
    return db.grades.count();
  }
}