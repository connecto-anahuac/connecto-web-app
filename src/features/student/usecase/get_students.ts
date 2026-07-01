import { StudentEntity } from "@/infra/local/entities";
import { StudentRepository } from "@/infra/local/repository/student.repository";

export class GetStudentUseCase {
  constructor(
    private readonly repository: StudentRepository,
  ) {}

  async execute(studentId: string): Promise<StudentEntity> {
    const res = await this.repository.findById(studentId);
    if (!res) {
      throw new Error("Student not found");
    }
    return res;
  }
}