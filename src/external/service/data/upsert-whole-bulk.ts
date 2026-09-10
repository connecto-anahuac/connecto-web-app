"use client";

import { StudentRecord } from "@/external/domain/university";
import { universityDb } from "@/external/client/university-db";
import {
  CourseRecord,
  GradeRecord,
  OfferingCourseRecord,
  PlanRecord,
  PreRequisitoRecord,
} from "@/external/domain/university";

type UpsertWholeBulkParams = {
  students?: StudentRecord[];
  grades?: GradeRecord[];
  plans?: PlanRecord[];
  courses?: CourseRecord[];
  preRequisitos?: PreRequisitoRecord[];
  offeringCourses?: OfferingCourseRecord[];
};

export async function upsertWholeBulk({
  students,
  grades,
  plans,
  courses,
  preRequisitos,
  offeringCourses,
}: UpsertWholeBulkParams): Promise<void> {
  try {
    await universityDb.transaction(
      "rw",
      [
        universityDb.students,
        universityDb.grades,
        universityDb.plans,
        universityDb.courses,
        universityDb.preRequisitos,
        universityDb.offeringCourses,
      ],
      async () => {
        if (students?.length) {
          await universityDb.students.bulkPut(students);
        }

        if (grades?.length) {
          await universityDb.grades.bulkPut(grades);
        }

        if (courses?.length) {
          await universityDb.courses.bulkPut(courses);
        }

        if (plans?.length) {
          await universityDb.plans.bulkPut(plans);
        }

        if (preRequisitos?.length) {
          await universityDb.preRequisitos.bulkPut(preRequisitos);
        }

        if (offeringCourses?.length) {
          await universityDb.offeringCourses.bulkPut(offeringCourses);
        }
      },
    );
  } catch (error) {
    console.error("DB initializer error:", error);
  }
}



// ===================================================================================
// "use client";
// /* 
// 同じIdを挿入しようとした場合、

// */

// import { universityDb } from "@/external/client/university-db";
// import {
//   CourseRecord,
//   GradeRecord,
//   OfferingCourseRecord,
//   PlanRecord,
//   PreRequisitoRecord,
//   StudentRecord,
// } from "@/external/domain/university";
// import type { Table } from "dexie";

// type UpsertWholeBulkParams = {
//   students?: StudentRecord[];
//   grades?: GradeRecord[];
//   plans?: PlanRecord[];
//   courses?: CourseRecord[];
//   preRequisitos?: PreRequisitoRecord[];
//   offeringCourses?: OfferingCourseRecord[];
// };

// function haveSameContent(left: unknown, right: unknown): boolean {
//   if (Object.is(left, right)) return true;

//   if (
//     typeof left !== "object" ||
//     left === null ||
//     typeof right !== "object" ||
//     right === null
//   ) {
//     return false;
//   }

//   if (Array.isArray(left) || Array.isArray(right)) {
//     return (
//       Array.isArray(left) &&
//       Array.isArray(right) &&
//       left.length === right.length &&
//       left.every((value, index) => haveSameContent(value, right[index]))
//     );
//   }

//   const leftRecord = left as Record<string, unknown>;
//   const rightRecord = right as Record<string, unknown>;
//   const leftKeys = Object.keys(leftRecord);
//   const rightKeys = Object.keys(rightRecord);

//   return (
//     leftKeys.length === rightKeys.length &&
//     leftKeys.every(
//       (key) =>
//         Object.hasOwn(rightRecord, key) &&
//         haveSameContent(leftRecord[key], rightRecord[key]),
//     )
//   );
// }

// async function insertOnlyNewRecords<T extends object, Key>(
//   table: Table<T, Key>,
//   records: T[],
//   getKey: (record: T) => Key | undefined,
//   tableName: string,
// ): Promise<void> {
//   for (const record of records) {
//     const key = getKey(record);

//     if (key === undefined) {
//       await table.add(record);
//       continue;
//     }

//     const existingRecord = await table.get(key);
//     if (!existingRecord) {
//       await table.add(record);
//       continue;
//     }

//     if (!haveSameContent(existingRecord, record)) {
//       console.warn(`Skipped ${tableName} record with conflicting key: ${String(key)}`, {
//         existingRecord,
//         incomingRecord: record,
//       });
//     }
//   }
// }

// export async function upsertWholeBulk({
//   students,
//   grades,
//   plans,
//   courses,
//   preRequisitos,
//   offeringCourses,
// }: UpsertWholeBulkParams): Promise<void> {
//   try {
//     await universityDb.transaction(
//       "rw",
//       [
//         universityDb.students,
//         universityDb.grades,
//         universityDb.plans,
//         universityDb.courses,
//         universityDb.preRequisitos,
//         universityDb.offeringCourses,
//       ],
//       async () => {
//         if (students?.length) {
//           await insertOnlyNewRecords(
//             universityDb.students,
//             students,
//             (student) => student.id,
//             "students",
//           );
//         }

//         if (grades?.length) {
//           await insertOnlyNewRecords(
//             universityDb.grades,
//             grades,
//             (grade) => grade.id,
//             "grades",
//           );
//         }

//         if (courses?.length) {
//           await insertOnlyNewRecords(
//             universityDb.courses,
//             courses,
//             (course) => course.key,
//             "courses",
//           );
//         }

//         if (plans?.length) {
//           await insertOnlyNewRecords(
//             universityDb.plans,
//             plans,
//             (plan) => plan.id,
//             "plans",
//           );
//         }

//         if (preRequisitos?.length) {
//           await insertOnlyNewRecords(
//             universityDb.preRequisitos,
//             preRequisitos,
//             (preRequisito) => preRequisito.id,
//             "preRequisitos",
//           );
//         }

//         if (offeringCourses?.length) {
//           await insertOnlyNewRecords(
//             universityDb.offeringCourses,
//             offeringCourses,
//             (offeringCourse) => offeringCourse.id,
//             "offeringCourses",
//           );
//         }
//       },
//     );
//   } catch (error) {
//     console.error("DB initializer error:", error);
//   }
// }
