import Dexie, { Table } from "dexie";

import {
  CourseRecord,
  ClassroomRecord,
  CourseAssignmentRecord,
  GradeRecord,
  OfferingCourseRecord,
  PlanRecord,
  PreRequisitoRecord,
  StudentRecord,
  ProfessorAvailabilityRecord,
  ProfessorCourseCapabilityRecord,
  ProfessorRecord,
  StudyPlanRecord,
  TimeSlotRecord,
} from "@/external/domain/university";

export function normalizeLegacyPlans(rows: PlanRecord[]): { plans: PlanRecord[]; studyPlans: StudyPlanRecord[] } {
  const byIdentity = new Map<string, StudyPlanRecord>();
  const plans = rows.map((source) => {
    const row = { ...source };
    const identity = `${row.career}\u0000${row.name}`;
    let studyPlan = byIdentity.get(identity);
    if (!studyPlan) {
      studyPlan = { id: migratedStudyPlanId(row.career, row.name), name: row.name, career: row.career, firstPeriod: "", admin: "" };
      byIdentity.set(identity, studyPlan);
    }
    row.planId = studyPlan.id;
    return row;
  });
  return { plans, studyPlans: [...byIdentity.values()] };
}

export function migratedStudyPlanId(career: string, name: string): string {
  return `migrated:${career}:${name}`;
}

function legacyMigratedStudyPlanId(career: string, name: string): string {
  return `migrated:${encodeURIComponent(career)}:${encodeURIComponent(name)}`;
}

export function migrateLegacyStudyPlanIds(
  studyPlans: StudyPlanRecord[],
  plans: PlanRecord[],
): { studyPlans: StudyPlanRecord[]; plans: PlanRecord[]; legacyIds: string[] } {
  const replacements = new Map<string, string>();
  const migratedStudyPlans = studyPlans.map((studyPlan) => {
    const legacyId = legacyMigratedStudyPlanId(studyPlan.career, studyPlan.name);
    const id = migratedStudyPlanId(studyPlan.career, studyPlan.name);
    if (legacyId === id || studyPlan.id !== legacyId) return studyPlan;

    replacements.set(legacyId, id);
    return { ...studyPlan, id };
  });

  return {
    studyPlans: migratedStudyPlans,
    plans: plans.map((plan) =>
      plan.planId && replacements.has(plan.planId)
        ? { ...plan, planId: replacements.get(plan.planId) }
        : plan,
    ),
    legacyIds: [...replacements.keys()],
  };
}

export async function clearLegacyProfessorAvailabilities(
  availabilities: Pick<Table<ProfessorAvailabilityRecord, string>, "clear">,
): Promise<void> {
  await availabilities.clear();
}

export class UniversityDB extends Dexie {
  courses!: Table<CourseRecord>;
  plans!: Table<PlanRecord>;
  students!: Table<StudentRecord>;
  grades!: Table<GradeRecord>;
  preRequisitos!: Table<PreRequisitoRecord>;
  offeringCourses!: Table<OfferingCourseRecord>;
  professors!: Table<ProfessorRecord>;
  professorCourseCapabilities!: Table<ProfessorCourseCapabilityRecord>;
  courseAssignments!: Table<CourseAssignmentRecord>;
  professorAvailabilities!: Table<ProfessorAvailabilityRecord>;
  timeSlots!: Table<TimeSlotRecord>;
  classrooms!: Table<ClassroomRecord>;
  studyPlans!: Table<StudyPlanRecord>;

  constructor() {
    super("UniversityDB");

    this.version(1).stores({
      courses: "key,keyCode,keyNumber,name",
      plans: "id,name,courseKey,career,semester,position",
      students: "id,name,status,currentSemester,currentSemesterWithoutSummer",
      grades: "++id,studentId,courseKey,period,grade",
      preRequisitos: "++id,currentCourseKey,preCourseKey",
    });

    this.version(2).stores({
      courses: "key,keyCode,keyNumber,name",
      plans: "id,name,courseKey,career,semester,position",
      students: "id,name,status,enrolledPeriod,currentSemester,regularSemestersCount,summerSemestersCount,career,failCount,period",
      grades: "++id,studentId,courseKey,period,grade",
      preRequisitos: "++id,currentCourseKey,preCourseKey",
      offeringCourses: "id,period,career,courseKey,sessionNumber,estimatedNumber,[career+period]",
    });

    this.version(3).stores({
      courses: "key,keyCode,keyNumber,name,block",
      plans: "id,name,planId,courseKey,career,semester,position,[career+semester]",
      students: "id,name,status,enrolledPeriod,currentSemester,regularSemestersCount,summerSemestersCount,career,failCount,period",
      grades: "++id,studentId,courseKey,period,grade",
      preRequisitos: "++id,currentCourseKey,preCourseKey",
      offeringCourses: "id,period,career,courseKey,sessionNumber,estimatedNumber,[career+period]",
      professors: "id,name,status,career,job",
      professorCourseCapabilities: "id,professorId,period,courseId,[professorId+period]",
      courseAssignments: "id,professorId,period,courseId,timeSlotId,classroomId,[professorId+period]",
      professorAvailabilities: "id,professorId,period,timeSlotId,[professorId+period]",
      timeSlots: "id,position",
      classrooms: "id,name,place,admin",
      studyPlans: "id,name,career,firstPeriod,admin",
    }).upgrade(async (transaction) => {
      const plans = transaction.table<PlanRecord, string>("plans");
      const studyPlans = transaction.table<StudyPlanRecord, string>("studyPlans");
      const normalized = normalizeLegacyPlans(await plans.toArray());
      if (normalized.studyPlans.length) await studyPlans.bulkPut(normalized.studyPlans);
      if (normalized.plans.length) await plans.bulkPut(normalized.plans);
    });

    this.version(4).stores({
      courses: "key,keyCode,keyNumber,name,block",
      plans: "id,name,planId,courseKey,career,semester,position,[career+semester]",
      students: "id,name,status,enrolledPeriod,currentSemester,regularSemestersCount,summerSemestersCount,career,failCount,period",
      grades: "++id,studentId,courseKey,period,grade",
      preRequisitos: "++id,currentCourseKey,preCourseKey",
      offeringCourses: "id,period,career,courseKey,sessionNumber,estimatedNumber,[career+period]",
      professors: "id,name,status,career,job",
      professorCourseCapabilities: "id,professorId,period,courseId,[professorId+period]",
      courseAssignments: "id,professorId,period,courseId,timeSlotId,classroomId,[professorId+period]",
      professorAvailabilities: "id,professorId,period,timeSlotId,[professorId+period]",
      timeSlots: "id,position",
      classrooms: "id,name,place,admin",
      studyPlans: "id,name,career,firstPeriod,admin",
    }).upgrade(async (transaction) => {
      const plans = transaction.table<PlanRecord, string>("plans");
      const studyPlans = transaction.table<StudyPlanRecord, string>("studyPlans");
      const migrated = migrateLegacyStudyPlanIds(
        await studyPlans.toArray(),
        await plans.toArray(),
      );

      if (!migrated.legacyIds.length) return;
      await studyPlans.bulkPut(migrated.studyPlans);
      await plans.bulkPut(migrated.plans);
      await studyPlans.bulkDelete(migrated.legacyIds);
    });

    this.version(5).stores({
      courses: "key,keyCode,keyNumber,name,block",
      plans: "id,name,planId,courseKey,career,semester,position,[career+semester]",
      students: "id,name,status,enrolledPeriod,currentSemester,regularSemestersCount,summerSemestersCount,career,failCount,period",
      grades: "++id,studentId,courseKey,period,grade",
      preRequisitos: "++id,currentCourseKey,preCourseKey",
      offeringCourses: "id,period,career,courseKey,sessionNumber,estimatedNumber,[career+period]",
      professors: "id,name,status,career,job",
      professorCourseCapabilities: "id,professorId,period,courseId,[professorId+period]",
      courseAssignments: "id,professorId,period,courseId,timeSlotId,classroomId,[professorId+period]",
      professorAvailabilities: "id,professorId,period,day,timeSlotId,[professorId+period],[professorId+period+day]",
      timeSlots: "id,position",
      classrooms: "id,name,place,admin",
      studyPlans: "id,name,career,firstPeriod,admin",
    }).upgrade(async (transaction) => {
      await clearLegacyProfessorAvailabilities(
        transaction.table<ProfessorAvailabilityRecord, string>("professorAvailabilities"),
      );
    });
  }
}

export const universityDb = new UniversityDB();
