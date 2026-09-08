import type {
  ProfessorAssignedSubjectDto,
  ProfessorAvailabilityDto,
  ProfessorCollectionDto,
} from "@/external/dto/professor/professor.dto";

export type ProfessorCollectionItem = ProfessorCollectionDto;
export type ProfessorAssignedSubject = ProfessorAssignedSubjectDto;
export type ProfessorAvailability = ProfessorAvailabilityDto;

export const professorDetailTabs = [
  "overview",
  "assigned-subjects",
  "available-hours",
] as const;

export type ProfessorDetailTab = (typeof professorDetailTabs)[number];
