import type { ClassroomCollectionDto, ClassroomDetailDto } from "@/external/dto/classroom/classroom.dto";
import { ClassroomRepository } from "@/external/repository/classroom.repository";
export class GetClassroomsService {
  constructor(private repository: ClassroomRepository) {}
  execute(): Promise<ClassroomCollectionDto[]> { return this.repository.findAll(); }
  async detail(id: string): Promise<ClassroomDetailDto | undefined> { return this.repository.findById(id); }
}

