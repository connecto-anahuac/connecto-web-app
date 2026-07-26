import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import { defineFilterField, type FilterDefinitionConfig } from "../../search/shared/filterField";

export const OFFERING_COURSE_FILTER_KEYS = {
  className: "offeringCourse.className",
} as const;

export type OfferingCourseFilterKey =
  (typeof OFFERING_COURSE_FILTER_KEYS)[keyof typeof OFFERING_COURSE_FILTER_KEYS];

export const OFFERING_COURSE_FILTER_FIELDS: FilterDefinitionConfig<OfferingCourse>[] = [
  defineFilterField<OfferingCourse>({
    key: OFFERING_COURSE_FILTER_KEYS.className,
    label: "Nombre de clase",
    icon:"class",
    valueType: "text",
    inputType: "free",
    getValue: (item) => item.name,
  }),
];