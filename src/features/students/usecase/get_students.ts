import { StudentEntity } from "@/infra/local/entities";
import { StudentRepository } from "@/infra/local/repository/student.repository";

export class GetStudentsUseCase {
  constructor(
    private readonly repository: StudentRepository,
  ) {}

  async execute(): Promise<StudentEntity[]> {
    return this.repository.findAll();
  }
}