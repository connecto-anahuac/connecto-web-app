// src/infrastructure/local/repositories/course.repository.ts

import { db } from "../databse";
import { CourseEntity } from "../entities";


// export class CourseRepository {
//   async save(course: Course): Promise<void> {
//     await db.courses.put(course);
//   }

//   async saveMany(courses: Course[]): Promise<void> {
//     await db.courses.bulkPut(courses);
//   }

//   async findById(id: string): Promise<Course | undefined> {
//     return db.courses.get(id);
//   }

//   async findAll(): Promise<Course[]> {
//     return db.courses.orderBy("position").toArray();
//   }

//   async findBySemester(
//     semester: number,
//   ): Promise<Course[]> {
//     return db.courses
//       .where("semester")
//       .equals(semester)
//       .sortBy("position");
//   }

//   async findByBlock(
//     block: string,
//   ): Promise<Course[]> {
//     return db.courses
//       .where("block")
//       .equals(block)
//       .toArray();
//   }

//   async delete(id: string): Promise<void> {
//     await db.courses.delete(id);
//   }

//   async clear(): Promise<void> {
//     await db.courses.clear();
//   }

//   async count(): Promise<number> {
//     return db.courses.count();
//   }
// }


export class CourseRepository {
  
    async UpsertBulk(courses: CourseEntity[]) : Promise<void> {
      try {
    
        console.log("writing-courses");
    
        await db.transaction(
          "rw",
          db.courses,
          async () => {
            if (courses.length) await db.courses.bulkPut(courses );
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
    
  async findAll(): Promise<CourseEntity[]> {
    return db.courses.orderBy("keyCode").toArray();
  }

  async findById(id: string) {
    return db.courses.get(id);
  }

  async findByBlock(block: string) {
    return db.courses
      .where("block")
      .equals(block)
      .toArray();
  }

  async findByKeyCode(keyCode: string) {
    return db.courses
      .where("keyCode")
      .equals(keyCode)
      .toArray();
  }

  async save(course: CourseEntity) {
    await db.courses.put(course);
  }

  async saveMany(courses: CourseEntity[]) {
    await db.courses.bulkPut(courses);
  }

  async delete(id: string) {
    await db.courses.delete(id);
  }
}