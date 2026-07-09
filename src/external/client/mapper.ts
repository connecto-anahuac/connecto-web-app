import { Student } from "../domain/student";
import { StudentEntity } from "../domain/university";

export function toStudent(student: StudentEntity): Student {
  return new Student({
    id: student.id,
    name: student.name,
    status: student.status,
    career: student.career,
    enrolledPeriod: student.enrolledPeriod,
    regularSemestersCount: student.regularSemestersCount,
    summerSemestersCount: student.summerSemestersCount,
    avatarColorRef: student.avatarColorRef,
  });
}