import type { ScheduleBuilderCourseDto } from "../../types";
import type { DataViewConfig } from "@/shared/types/dataView.types";

export type ScheduleBuilderOfferingCourse = {
  key: string;
  keyCode: string;
  keyNumber: string;
  hours: number;
  credits: number;
  block: string;
  name: string;
  semester: number;
  estimatedNumber: number;
  position: number;
  preRequisites: string[];
};

export const SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS = {
  key: "key",
  hours: "hours",
  credits: "credits",
  block: "block",
  name: "name",
  semester: "semester",
  estimatedNumber: "estimatedNumber",
} as const;

export type ScheduleBuilderOfferingCourseFilterKey =
  (typeof SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS)[keyof typeof SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS];

const displayNumber = (value: number) => Number.isNaN(value) ? "--" : String(value);

export const SCHEDULE_BUILDER_OFFERING_COURSE_VIEW_CONFIG = {
  fields: [
    {
      fieldId: SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.key,
      label: "Clave",
      icon: "hashmark",
      valueType: "enum",
      dynamicOption: true,
      accessor: (item) => item.key,
      format: (item) => `${item.keyCode}${item.keyNumber}`,
      searchTexts: (item) => [item.keyCode, item.keyNumber, `${item.keyCode}${item.keyNumber}`],
    },
    {
      fieldId: SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.hours,
      label: "Horas",
      icon: "schedule",
      valueType: "number",
      accessor: (item) => item.hours,
      format: (item) => displayNumber(item.hours),
    },
    {
      fieldId: SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.credits,
      label: "Créditos",
      icon: "schoolHat",
      valueType: "number",
      accessor: (item) => item.credits,
      format: (item) => displayNumber(item.credits),
    },
    {
      fieldId: SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.block,
      label: "Bloque",
      icon: "book",
      valueType: "enum",
      dynamicOption: true,
      accessor: (item) => item.block || null,
      format: (item) => item.block || "--",
    },
    {
      fieldId: SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.name,
      label: "Nombre de materia",
      icon: "class",
      valueType: "text",
      accessor: (item) => item.name,
      format: (item) => item.name,
    },
    {
      fieldId: SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.semester,
      label: "Semestre",
      icon: "schedule",
      valueType: "number",
      accessor: (item) => item.semester,
      format: (item) => displayNumber(item.semester),
    },
    {
      fieldId: SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.estimatedNumber,
      label: "Estudiantes estimados",
      icon: "person",
      valueType: "number",
      accessor: (item) => item.estimatedNumber,
      format: (item) => displayNumber(item.estimatedNumber),
    },
  ],
} satisfies DataViewConfig<ScheduleBuilderOfferingCourse, ScheduleBuilderOfferingCourseFilterKey>;

export function toScheduleBuilderOfferingCourse(
  source: ScheduleBuilderCourseDto,
): ScheduleBuilderOfferingCourse {
  return {
    key: source.courseKey,
    keyCode: source.course.keyCode,
    keyNumber: source.course.keyNumber,
    hours: source.course.hours,
    credits: source.course.credits,
    block: source.course.block,
    name: source.course.name,
    semester: source.course.recommendedSemesters[0] ?? 0,
    estimatedNumber: source.estimatedNumber,
    position: 0,
    preRequisites: [],
  };
}
