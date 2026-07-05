import { getStudentPlanUseCase } from "@/infra/di";
import { StudentRepository } from "@/infra/local/repository/student.repository";

const studentRepository = new StudentRepository();

export async function fetchStudentById(studentId: string) {
  return studentRepository.findById(studentId);
}

export async function fetchStudentPlan(studentId: string) {
  return getStudentPlanUseCase.execute(studentId);
}