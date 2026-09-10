import type { DataViewConfig } from "@/shared/types/dataView.types";
import { generateAccentCombinations } from "@/shared/lib/util";
import type { ProfessorCollectionItem } from "../../../types/professor";

export type ProfessorCollectionFieldId =
  | "id"
  | "name"
  | "status"
  | "career"
  | "job"
  | "assignableSubjects"
  | "assignedHours";

const text = (value: string) => value || "--";

export const PROFESSOR_COLLECTION_VIEW_CONFIG = {
  fields: [
    { fieldId: "id", label: "ID", icon: "hashmark", valueType: "text", accessor: (item) => item.id, format: (item) => text(item.id) },
    { fieldId: "name", label: "Nombre", icon: "professor", valueType: "text", accessor: (item) => item.name, format: (item) => text(item.name), searchTexts: (item) => generateAccentCombinations(item.name) },
    { fieldId: "status", label: "Estado", icon: "status", valueType: "enum", dynamicOption: true, accessor: (item) => item.status, format: (item) => text(item.status) },
    { fieldId: "career", label: "Carrera", icon: "schoolHat", valueType: "enum", dynamicOption: true, accessor: (item) => item.career, format: (item) => text(item.career) },
    { fieldId: "job", label: "Puesto", icon: "admin", valueType: "enum", dynamicOption: true, accessor: (item) => item.job, format: (item) => text(item.job) },
    { fieldId: "assignableSubjects", label: "Materias asignables", icon: "class", valueType: "number", accessor: (item) => item.assignableSubjects, format: (item) => String(item.assignableSubjects) },
    { fieldId: "assignedHours", label: "Horas asignadas", icon: "schedule", valueType: "number", accessor: (item) => item.assignedHours, format: (item) => String(item.assignedHours) },
  ],
} satisfies DataViewConfig<ProfessorCollectionItem, ProfessorCollectionFieldId>;
