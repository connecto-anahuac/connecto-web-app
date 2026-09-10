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

export function normalizePlansByCareer(
  studyPlans: StudyPlanRecord[],
  plans: PlanRecord[],
): { studyPlans: StudyPlanRecord[]; plans: PlanRecord[]; obsoleteStudyPlanIds: string[] } {
  const byCareer = new Map<string, StudyPlanRecord>();
  const obsoleteStudyPlanIds: string[] = [];

  for (const studyPlan of studyPlans) {
    if (!byCareer.has(studyPlan.career)) {
      byCareer.set(studyPlan.career, {
        ...studyPlan,
        id: studyPlan.career,
        name: studyPlan.career,
      });
    }
    if (studyPlan.id !== studyPlan.career) obsoleteStudyPlanIds.push(studyPlan.id);
  }

  const normalizedPlans = plans.map((plan) => {
    if (!byCareer.has(plan.career)) {
      byCareer.set(plan.career, {
        id: plan.career,
        name: plan.career,
        career: plan.career,
        firstPeriod: "",
        admin: "",
      });
    }

    return { ...plan, name: plan.career, planId: plan.career };
  });
  const normalizedStudyPlans = [...byCareer.values()];
  const normalizedIds = new Set(normalizedStudyPlans.map((studyPlan) => studyPlan.id));

  return {
    studyPlans: normalizedStudyPlans,
    plans: normalizedPlans,
    obsoleteStudyPlanIds: [...new Set(obsoleteStudyPlanIds)].filter(
      (id) => !normalizedIds.has(id),
    ),
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
      const normalized = normalizePlansByCareer([], await plans.toArray());
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

    this.version(6).stores({
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
    });

    this.version(7).stores({
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
      const plans = transaction.table<PlanRecord, string>("plans");
      const studyPlans = transaction.table<StudyPlanRecord, string>("studyPlans");
      const normalized = normalizePlansByCareer(
        await studyPlans.toArray(),
        await plans.toArray(),
      );

      await studyPlans.bulkPut(normalized.studyPlans);
      await plans.bulkPut(normalized.plans);
      if (normalized.obsoleteStudyPlanIds.length) {
        await studyPlans.bulkDelete(normalized.obsoleteStudyPlanIds);
      }
    });
  }
}

export const universityDb = new UniversityDB();
