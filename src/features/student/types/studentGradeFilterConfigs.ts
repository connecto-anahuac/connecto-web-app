import type { StudentClassItem } from "@/features/student/types";
import { defineDataProperty, type DataPropertyConfig } from "../../search/shared/filterField";
import type { FilterPresetConfig } from "@/features/search/shared/filterPreset.type";

export const STUDENT_GRADE_FILTER_KEYS = {
  className: "studentPlan.className",
  classCodeAndNumber: "studentPlan.classCodeAndNumber",
  period: "studentPlan.period",
  grade: "studentPlan.grade",
  status: "studentPlan.status",
} as const;

export type StudentPlanFilterKey =
  (typeof STUDENT_GRADE_FILTER_KEYS)[keyof typeof STUDENT_GRADE_FILTER_KEYS];

export const STUDENT_GRADE_FILTER_FIELDS: DataPropertyConfig<StudentClassItem>[] =
  [
    defineDataProperty<StudentClassItem>({
      key: STUDENT_GRADE_FILTER_KEYS.className,
      label: "Nombre de materia",
      icon: "class",
      valueType: "text",
      inputType: "free",
      getValue: (item) => item.name,
      search: true,
    }),
    defineDataProperty<StudentClassItem>({
      key: STUDENT_GRADE_FILTER_KEYS.classCodeAndNumber,
      label: "Clave de materia",
      icon: "hashmark",
      valueType: "enum",
      inputType: "option",
      dynamicOptions: true,
      getValue: (item) => `${item.keyCode}${item.keyNumber}`.trim(),
      search: true,
    }),
    defineDataProperty<StudentClassItem>({
      key: STUDENT_GRADE_FILTER_KEYS.period,
      label: "Periodo",
      icon: "schedule",
      valueType: "enum",
      inputType: "option",
      dynamicOptions: true,
      getValue: (item) => item.period?.raw ?? null,
      search: true,
    }),
    defineDataProperty<StudentClassItem>({
      key: STUDENT_GRADE_FILTER_KEYS.grade,
      label: "Calificación",
      icon: "schoolHat",
      valueType: "number",
      inputType: "free",
      getValue: (item) => item.grade,
      search: true,
    }),
    defineDataProperty<StudentClassItem>({
      key: STUDENT_GRADE_FILTER_KEYS.status,
      label: "Estado",
      icon: "status",
      valueType: "enum",
      inputType: "option",
      options: [
        { label: "Reprobado", value: "failed" },
        { label: "Aprobado", value: "passed" },
        { label: "Cruzado", value: "isTaking" },
        { label: "Posibles", value: "enrollable" },
        {
          label: "Bloqueado por prerrequisitos",
          value: "lockedByPreRequisites",
        },
        { label: "Bloqueado por otros razones", value: "lockedByOthers" },
      ],
      getValue: (item) => item.status,
      search: true,
    }),
  ];

export const STUDENT_GRADE_FILTER_PRESET: readonly FilterPresetConfig<StudentPlanFilterKey>[] =
  [
    // {
    //   filterKey: STUDENT_GRADE_FILTER_KEYS.grade,
    //   label: "reprobado",
    //   conditionValue: 6,
    //   operator: "lt",
    // },
    // {
    //   filterKey: STUDENT_GRADE_FILTER_KEYS.grade,
    //   label: "aprobado",
    //   conditionValue: 6,
    //   operator: "gte",
    // },
    {
      filterKey: STUDENT_GRADE_FILTER_KEYS.status,
      label: "Reprobado",
      conditionValue: ["failed"],
      operator: "in",
    },
    {
      filterKey: STUDENT_GRADE_FILTER_KEYS.status,
      label: "Aprobado",
      conditionValue: ["passed"],
      operator: "in",
    },
    {
      filterKey: STUDENT_GRADE_FILTER_KEYS.status,
      label: "Cruzado",
      conditionValue: ["isTaking"],
      operator: "in",
    },
    {
      filterKey: STUDENT_GRADE_FILTER_KEYS.status,
      label: "Posibles",
      conditionValue: ["enrollable"],
      operator: "in",
    },
    {
      filterKey: STUDENT_GRADE_FILTER_KEYS.status,
      label: "Bloqueado",
      conditionValue: ["lockedByPreRequisites", "lockedByOthers"],
      operator: "in",
    },
  ];
