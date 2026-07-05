import { getStudentsUseCase } from "@/infra/di";

export async function fetchStudents() {
  return getStudentsUseCase.execute();
}