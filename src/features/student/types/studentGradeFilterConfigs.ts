import type { StudentClassItem } from "@/features/student/types";
import {
  defineFilterField,
  type FilterDefinitionConfig,
} from "../../search/shared/filterField";
import type { FilterPresetConfig } from "@/features/search/shared/filterPreset.type";

export const STUDENT_GRADE_FILTER_KEYS = {
  className: "studentPlan.className",
  classCodeAndNumber: "studentPlan.classCodeAndNumber",
  period: "studentPlan.period",
  grade: "studentPlan.grade",
} as const;

export type StudentPlanFilterKey =
  (typeof STUDENT_GRADE_FILTER_KEYS)[keyof typeof STUDENT_GRADE_FILTER_KEYS];

export const STUDENT_GRADE_FILTER_FIELDS: FilterDefinitionConfig<StudentClassItem>[] = [
  defineFilterField<StudentClassItem>({
    key: STUDENT_GRADE_FILTER_KEYS.className,
    label: "Nombre de materia",
    icon: "class",
    valueType: "text",
    inputType: "free",
    getValue: (item) => item.name,
  }),
  defineFilterField<StudentClassItem>({
    key: STUDENT_GRADE_FILTER_KEYS.classCodeAndNumber,
    label: "Clave de materia",
    icon: "hashmark",
    valueType: "enum",
    inputType: "option",
    dynamicOptions: true,
    getValue: (item) => `${item.keyCode}${item.keyNumber}`.trim(),
  }),
  defineFilterField<StudentClassItem>({
    key: STUDENT_GRADE_FILTER_KEYS.period,
    label: "Periodo",
    icon: "schedule",
    valueType: "enum",
    inputType: "option",
    dynamicOptions: true,
    getValue: (item) => item.period,
  }),
  defineFilterField<StudentClassItem>({
    key: STUDENT_GRADE_FILTER_KEYS.grade,
    label: "Calificación",
    icon: "schoolHat",
    valueType: "number",
    inputType: "free",
    getValue: (item) => item.grade,
  }),
];

export const STUDENT_GRADE_FILTER_PRESET: readonly FilterPresetConfig<StudentPlanFilterKey>[] = [
  {
    filterKey: STUDENT_GRADE_FILTER_KEYS.grade,
    label: "reprobado",
    conditionValue: 6,
    operator: "lt",
  },
  {
    filterKey: STUDENT_GRADE_FILTER_KEYS.grade,
    label: "aprobado",
    conditionValue: 6,
    operator: "gte",
  },
];
