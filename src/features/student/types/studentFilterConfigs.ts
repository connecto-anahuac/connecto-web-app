import type { DataViewConfig } from "@/components/table/dataView.types";
import type { StudentListItem } from "@/features/students/types/student-list-item";

export const STUDENT_FILTER_KEYS = {
  name: "name",
  status: "estatus",
  currentSemester: "semester",
  career: "career",
  plan: "plan",
  failCount: "materias reprobadas",
} as const;

export type StudentFilterKey =
  (typeof STUDENT_FILTER_KEYS)[keyof typeof STUDENT_FILTER_KEYS];

export const STUDENT_CAREER_OPTIONS = [
  { label: "TIND", value: "TIND" },
  { label: "Civil", value: "Civil" },
  { label: "Ambiental", value: "Ambiental" },
  { label: "Industrial", value: "Industrial" },
] as const;

export const STUDENT_STATUS_OPTIONS = [
  { label: "Activo", value: "Activo" },
  { label: "Inactivo", value: "Inactivo" },
  { label: "Baja Académica", value: "Baja Académica" },
  { label: "Baja voluntaria", value: "Baja voluntaria" },
] as const;

export const STUDENT_VIEW_CONFIG: DataViewConfig<StudentListItem> = {
  fields: [
    {
      fieldId: STUDENT_FILTER_KEYS.name,
      label: "Nombre",
      icon: "person",
      valueType: "text",
      accessor: (student) => student.name,
      format: (student) => student.name,
    },
    {
      fieldId: STUDENT_FILTER_KEYS.status,
      label: "Estatus",
      icon: "status",
      valueType: "enum",
      options: STUDENT_STATUS_OPTIONS,
      accessor: (student) => student.status,
      format: (student) => student.status,
    },
    {
      fieldId: STUDENT_FILTER_KEYS.currentSemester,
      label: "Semestre",
      icon: "schedule",
      valueType: "enum",
      dynamicOption: true,
      accessor: (student) => student.currentSemester,
      format: (student) => String(student.currentSemester),
    },
    {
      fieldId: STUDENT_FILTER_KEYS.career,
      label: "Carrera",
      icon: "schoolHat",
      valueType: "enum",
      options: STUDENT_CAREER_OPTIONS,
      accessor: (student) => student.career,
      format: (student) => student.career,
    },
    {
      fieldId: STUDENT_FILTER_KEYS.plan,
      label: "Plan",
      icon: "schoolHat",
      valueType: "enum",
      dynamicOption: true,
      accessor: (student) => student.plan,
      format: (student) => student.plan,
    },
    {
      fieldId: STUDENT_FILTER_KEYS.failCount,
      label: "Numero de materias reprobadas",
      icon: "failedClass",
      valueType: "number",
      accessor: (student) => student.failCount,
      format: (student) => String(student.failCount),
    },
  ],
};
