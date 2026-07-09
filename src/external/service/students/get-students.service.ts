import { Student } from "@/external/domain/student";
import { StudentRecord } from "@/external/domain/university";
import { StudentRepository } from "@/external/repository/student.repository";

export class GetStudentsService {
  constructor(private readonly repository: StudentRepository) {}

  async execute(): Promise<Student[]> {
    return this.repository.findAll();
  }
}