import { universityDb } from "@/external/client/university-db";
import type { ClassroomRecord } from "@/external/domain/university";
export class ClassroomRepository {
  findAll(): Promise<ClassroomRecord[]> { return universityDb.classrooms.toArray(); }
  findById(id: string): Promise<ClassroomRecord | undefined> { return universityDb.classrooms.get(id); }
}

