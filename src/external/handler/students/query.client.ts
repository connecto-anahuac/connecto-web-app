import { toStudentDto, type StudentDto } from "@/external/dto/student/student.dto";
import { getStudentsService } from "@/external/service/di";

export async function fetchStudents(): Promise<StudentDto[]> {
  const students = await getStudentsService.execute();
  return students.map(toStudentDto);
}