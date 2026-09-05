import { GradeRepository } from "@/external/repository/grade.repository";
import { initializeUniversityDataClient } from "@/external/handler/data/initialize.client";
import type { StudentCollectionSummaryDto } from "@/external/dto/student/student-collection.dto";
import { toStudentDto, type StudentDto } from "@/external/dto/student/student.dto";
import {
  getStudentCollectionSummariesService,
  getStudentsService,
} from "@/external/service/di";

const gradeRepository = new GradeRepository();

export async function fetchStudents(): Promise<StudentDto[]> {
  const [students, grades] = await Promise.all([
    getStudentsService.execute(),
    gradeRepository.findAll(),
  ]);

  const reprobadoByStudentId = grades.reduce<Record<string, number>>((accumulator, grade) => {
    if (typeof grade.grade !== "number" || typeof grade.period !== "string" || grade.grade >= 6) {
      return accumulator;
    }

    accumulator[grade.studentId] = (accumulator[grade.studentId] ?? 0) + 1;
    return accumulator;
  }, {});

  return students.map((student) => ({
    ...toStudentDto(student),
    reprobado: reprobadoByStudentId[student.id] ?? 0,
  }));
}

export async function fetchStudentCollectionSummaries(): Promise<
  StudentCollectionSummaryDto[]
> {
  await initializeUniversityDataClient();
  return getStudentCollectionSummariesService.execute();
}
