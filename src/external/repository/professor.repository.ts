import { universityDb } from "@/external/client/university-db";
import type { CourseAssignmentRecord, ProfessorAvailabilityRecord, ProfessorCourseCapabilityRecord, ProfessorRecord } from "@/external/domain/university";

export class ProfessorRepository {
  findAll(): Promise<ProfessorRecord[]> { return universityDb.professors.toArray(); }
  findById(id: string): Promise<ProfessorRecord | undefined> { return universityDb.professors.get(id); }
  findCapabilities(): Promise<ProfessorCourseCapabilityRecord[]> { return universityDb.professorCourseCapabilities.toArray(); }
  findAssignments(): Promise<CourseAssignmentRecord[]> { return universityDb.courseAssignments.toArray(); }
  findAvailabilities(): Promise<ProfessorAvailabilityRecord[]> { return universityDb.professorAvailabilities.toArray(); }
}

