import type { StudyPlanCollectionDto, StudyPlanCourseDto } from "@/external/dto/study-plan/study-plan.dto";
import type { DataViewConfig } from "@/shared/types/dataView.types";

export const PLAN_COLLECTION_CONFIG = { fields: [
  { fieldId: "id", label: "ID", icon: "hashmark", valueType: "text", accessor: (item) => item.id, format: (item) => item.id },
  { fieldId: "name", label: "Nombre", icon: "curriculum", valueType: "text", accessor: (item) => item.name, format: (item) => item.name },
  { fieldId: "firstPeriod", label: "Primer periodo", icon: "schedule", valueType: "text", accessor: (item) => item.firstPeriod, format: (item) => item.firstPeriod || "--" },
  { fieldId: "admin", label: "Administrador", icon: "admin", valueType: "text", accessor: (item) => item.admin, format: (item) => item.admin || "--" },
] } satisfies DataViewConfig<StudyPlanCollectionDto>;

export const PLAN_COURSE_CONFIG = { fields: [
  { fieldId: "keyCode", label: "Clave", icon: "hashmark", valueType: "text", accessor: (item) => item.keyCode, format: (item) => item.keyCode },
  { fieldId: "keyNumber", label: "Número", icon: "hashmark", valueType: "text", accessor: (item) => item.keyNumber, format: (item) => item.keyNumber },
  { fieldId: "name", label: "Materia", icon: "class", valueType: "text", accessor: (item) => item.name, format: (item) => item.name },
  { fieldId: "hours", label: "Horas", icon: "schedule", valueType: "number", accessor: (item) => item.hours, format: (item) => String(item.hours) },
  { fieldId: "credits", label: "Créditos", icon: "schoolHat", valueType: "number", accessor: (item) => item.credits, format: (item) => String(item.credits) },
  { fieldId: "semester", label: "Semestre", icon: "curriculum", valueType: "number", accessor: (item) => item.semester, format: (item) => String(item.semester) },
  { fieldId: "position", label: "Posición", icon: "list", valueType: "number", accessor: (item) => item.position, format: (item) => String(item.position) },
] } satisfies DataViewConfig<StudyPlanCourseDto>;
