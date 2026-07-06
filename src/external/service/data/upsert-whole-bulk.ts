"use client";

import { universityDb } from "@/external/client/university-db";
import {
  CourseEntity,
  GradeEntity,
  OfferingCourseEntity,
  PlanEntity,
  PreRequisitoEntity,
  StudentEntity,
} from "@/external/domain/university";

type UpsertWholeBulkParams = {
  students?: StudentEntity[];
  grades?: GradeEntity[];
  plans?: PlanEntity[];
  courses?: CourseEntity[];
  preRequisitos?: PreRequisitoEntity[];
  offeringCourses?: OfferingCourseEntity[];
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