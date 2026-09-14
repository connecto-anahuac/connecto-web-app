import type { DataViewConfig } from "@/shared/types/dataView.types";
import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";

export const OFFERING_COURSE_FILTER_KEYS = {
  key: "key",
  hours: "hours",
  credits: "credits",
  block: "block",
  name: "name",
  semester: "semester",
  preRequisites: "preRequisites",
  estimatedNumber: "estimatedNumber",
} as const;

export type OfferingCourseFilterKey =
  (typeof OFFERING_COURSE_FILTER_KEYS)[keyof typeof OFFERING_COURSE_FILTER_KEYS];

const displayNumber = (value: number | null) =>
  value === null || Number.isNaN(value) ? "--" : String(value);

export const OFFERING_COURSE_VIEW_CONFIG = {
  fields: [
    {
      fieldId: OFFERING_COURSE_FILTER_KEYS.key,
      label: "Clave",
      icon: "hashmark",
      valueType: "enum",
      dynamicOption: true,
      accessor: (item) => item.key,
      format: (item) => `${item.keyCode}${item.keyNumber}`,
      searchTexts: (item) => [
        item.keyCode,
        item.keyNumber,
        `${item.keyCode}${item.keyNumber}`,
        `${item.keyCode} ${item.keyNumber}`,
      ],
    },
    {
      fieldId: OFFERING_COURSE_FILTER_KEYS.hours,
      label: "Horas",
      icon: "schedule",
      valueType: "number",
      accessor: (item) => item.hours,
      format: (item) => displayNumber(item.hours),
    },
    {
      fieldId: OFFERING_COURSE_FILTER_KEYS.credits,
      label: "Créditos",
      icon: "schoolHat",
      valueType: "number",
      accessor: (item) => item.credits,
      format: (item) => displayNumber(item.credits),
    },
    {
      fieldId: OFFERING_COURSE_FILTER_KEYS.block,
      label: "Bloque",
      icon: "book",
      valueType: "enum",
      dynamicOption: true,
      accessor: (item) => item.block || null,
      format: (item) => item.block || "--",
    },
    {
      fieldId: OFFERING_COURSE_FILTER_KEYS.name,
      label: "Nombre de materia",
      icon: "class",
      valueType: "text",
      accessor: (item) => item.name,
      format: (item) => item.name,
    },
    {
      fieldId: OFFERING_COURSE_FILTER_KEYS.semester,
      label: "Semestre",
      icon: "schedule",
      valueType: "number",
      accessor: (item) => item.semester,
      format: (item) => displayNumber(item.semester),
    },
    {
      fieldId: OFFERING_COURSE_FILTER_KEYS.preRequisites,
      label: "Prerrequisitos",
      icon: "curriculum",
      valueType: "text",
      accessor: (item) => item.preRequisites.join(", "),
      format: (item) => item.preRequisites.join(", ") || "--",
    },
    {
      fieldId: OFFERING_COURSE_FILTER_KEYS.estimatedNumber,
      label: "Estudiantes estimados",
      icon: "person",
      valueType: "number",
      accessor: (item) => item.estimatedNumber,
      format: (item) => displayNumber(item.estimatedNumber),
    },
  ],
} satisfies DataViewConfig<OfferingCourse, OfferingCourseFilterKey>;
