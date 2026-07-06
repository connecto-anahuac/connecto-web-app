import { StudentEntity } from "@/external/domain/university";
import { StudentRepository } from "@/external/repository/student.repository";

export class GetStudentsService {
  constructor(private readonly repository: StudentRepository) {}

  async execute(): Promise<StudentEntity[]> {
    return this.repository.findAll();
  }
}