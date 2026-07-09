import type { StudentClassItem } from "@/features/student/types";
import { defineFilterField, type FilterField } from "../../search/shared/filter-field";

export const STUDENT_PLAN_FILTER_KEYS = {
  className: "studentPlan.className",
  classCodeAndNumber: "studentPlan.classCodeAndNumber",
  period: "studentPlan.period",
  grade: "studentPlan.grade",
} as const;

export type StudentPlanFilterKey =
  (typeof STUDENT_PLAN_FILTER_KEYS)[keyof typeof STUDENT_PLAN_FILTER_KEYS];

export const STUDENT_PLAN_FILTER_FIELDS: FilterField<StudentClassItem>[] = [
  defineFilterField<StudentClassItem>({
    key: STUDENT_PLAN_FILTER_KEYS.className,
    label: "Nombre de materia",
    valueType: "text",
    inputType: "free",
    getValue: (item) => item.name,
  }),
  defineFilterField<StudentClassItem>({
    key: STUDENT_PLAN_FILTER_KEYS.classCodeAndNumber,
    label: "Clave de materia",
    valueType: "text",
    inputType: "free",
    getValue: (item) => `${item.keyCode} ${item.keyNumber}`.trim(),
  }),
  defineFilterField<StudentClassItem>({
    key: STUDENT_PLAN_FILTER_KEYS.period,
    label: "Periodo",
    valueType: "enum",
    inputType: "option",
    dynamicOptions: true,
    getValue: (item) => item.period,
  }),
  defineFilterField<StudentClassItem>({
    key: STUDENT_PLAN_FILTER_KEYS.grade,
    label: "Calificación",
    valueType: "number",
    inputType: "free",
    getValue: (item) => item.grade,
  }),
];