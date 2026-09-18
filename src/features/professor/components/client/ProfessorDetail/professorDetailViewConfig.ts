import type { DataViewConfig } from "@/shared/types/dataView.types";
import type { ProfessorAssignedSubject, ProfessorAvailability } from "../../../types/professor";

export const ASSIGNED_SUBJECTS_VIEW_CONFIG = {
  fields: [
    { fieldId: "courseId", label: "Clave", icon: "hashmark", valueType: "text", accessor: (item) => item.courseId, format: (item) => item.courseId || "--" },
    { fieldId: "course", label: "Materia", icon: "class", valueType: "text", accessor: (item) => item.course, format: (item) => item.course || "--" },
    { fieldId: "timeSlot", label: "Horario", icon: "schedule", valueType: "text", accessor: (item) => item.timeSlot, format: (item) => item.timeSlot || "--" },
    { fieldId: "classroom", label: "Salon", icon: "door", valueType: "text", accessor: (item) => item.classroom, format: (item) => item.classroom || "--" },
  ],
} satisfies DataViewConfig<ProfessorAssignedSubject>;

const submissionLabels = { available: "Disponible", unavailable: "No disponible", unsubmitted: "No enviado" } as const;
const dayLabels = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
} as const;

export const getProfessorAvailabilityRowId = (item: Pick<ProfessorAvailability, "day" | "timeSlotId">) => `${item.day}-${item.timeSlotId}`;

export const AVAILABILITY_VIEW_CONFIG = {
  fields: [
    { fieldId: "day", label: "Día", icon: "schedule", valueType: "text", accessor: (item) => item.day, format: (item) => dayLabels[item.day] },
    { fieldId: "timeSlotId", label: "Hora", icon: "schedule", valueType: "text", accessor: (item) => item.timeSlotId, format: (item) => item.timeSlotId },
    { fieldId: "startTime", label: "Inicio", icon: "schedule", valueType: "text", accessor: (item) => item.startTime, format: (item) => item.startTime },
    { fieldId: "endTime", label: "Fin", icon: "schedule", valueType: "text", accessor: (item) => item.endTime, format: (item) => item.endTime },
    { fieldId: "submissionStatus", label: "Estado de envío", icon: "status", valueType: "enum", accessor: (item) => item.submissionStatus, format: (item) => submissionLabels[item.submissionStatus] },
    { fieldId: "isAvailable", label: "Disponibilidad", icon: "status", valueType: "enum", accessor: (item) => item.isAvailable === null ? "unsubmitted" : String(item.isAvailable), format: (item) => item.isAvailable === null ? "--" : item.isAvailable ? "Sí" : "No" },
  ],
} satisfies DataViewConfig<ProfessorAvailability>;
