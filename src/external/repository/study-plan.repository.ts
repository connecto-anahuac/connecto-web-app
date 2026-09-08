import { universityDb } from "@/external/client/university-db";
import type { StudyPlanRecord } from "@/external/domain/university";
export class StudyPlanRepository {
  findAll(): Promise<StudyPlanRecord[]> { return universityDb.studyPlans.toArray(); }
  findById(id: string): Promise<StudyPlanRecord | undefined> { return universityDb.studyPlans.get(id); }
}

