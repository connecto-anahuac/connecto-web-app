import { Student } from "../domain/student";
import { StudentEntity } from "../domain/university";

export function toStudent(student: StudentEntity): Student {
  return {
    id: student.id,
    name: student.name,
    status: student.status,
    enrolledPeriod: student.enrolledPeriod,
    currentSemester: student.currentSemester,
    regularSemestersCount: student.regularSemestersCount,
    summerSemestersCount: student.summerSemestersCount,
      avatarColorRef: student.avatarColorRef,
    
  };
}