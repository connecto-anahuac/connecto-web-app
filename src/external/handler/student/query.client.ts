import {
  toStudentDto,
  toStudentPlanItemDto,
  type StudentDto,
  type StudentPlanItemDto,
} from "@/external/dto/student/student.dto";
import { getStudentPlanService, studentQueryRepository } from "@/external/service/di";

export async function fetchStudentById(studentId: string): Promise<StudentDto | null> {
  const student = await studentQueryRepository.findById(studentId);
  return student ? toStudentDto(student) : null;
}

export async function fetchStudentPlan(studentId: string): Promise<StudentPlanItemDto[]> {
  const studentPlan = await getStudentPlanService.execute(studentId);
  return studentPlan.map(toStudentPlanItemDto);
}