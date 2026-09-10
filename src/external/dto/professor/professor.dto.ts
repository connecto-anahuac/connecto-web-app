import type { WeekDay } from "@/external/domain/university";

export type ProfessorCollectionDto = {
  id: string; name: string; status: string; career: string; job: string;
  assignableSubjects: number; assigned: number; assignedHours: number;
};
export type ProfessorAssignedSubjectDto = { courseId: string; course: string; timeSlot: string; classroom: string };
export type ProfessorAvailabilityDto = {
  day: WeekDay;
  timeSlotId: string; startTime: string; endTime: string; position: number;
  submissionStatus: "available" | "unavailable" | "unsubmitted"; isAvailable: boolean | null;
};
export type ProfessorDetailDto = {
  id: string; name: string; status: string; career: string; job: string;
  email1: string; email2: string; phone: string; period: string;
  assigned: number; assignableSubjects: number; assignedHours: number;
  assignedSubjects: ProfessorAssignedSubjectDto[]; availability: ProfessorAvailabilityDto[];
};
