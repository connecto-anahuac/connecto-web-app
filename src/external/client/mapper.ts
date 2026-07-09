import { Student } from "../domain/student";
import { StudentRecord } from "../domain/university";

export function RecordtoStudent(student: StudentRecord): Student {
  return new Student({
    avatarColorRef: student.avatarColorRef,
    failCount: student.failCount,

    id: student.id,
    name: student.name,
    status: student.status,
    career: student.career,
    enrolledPeriod: student.enrolledPeriod,
    regularSemestersCount: student.regularSemestersCount,
    summerSemestersCount: student.summerSemestersCount,
  });
}
