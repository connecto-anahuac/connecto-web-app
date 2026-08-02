import type { DataViewConfig } from "@/shared/component/composite/table/dataView.types";
import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";

export const OFFERING_COURSE_FILTER_KEYS = {
  className: "offeringCourse.className",
} as const;

export type OfferingCourseFilterKey =
  (typeof OFFERING_COURSE_FILTER_KEYS)[keyof typeof OFFERING_COURSE_FILTER_KEYS];

export const OFFERING_COURSE_VIEW_CONFIG: DataViewConfig<OfferingCourse> = {
  fields: [
    {
      fieldId: OFFERING_COURSE_FILTER_KEYS.className,
      label: "Nombre de clase",
      icon: "class",
      valueType: "text",
      accessor: (item) => item.name,
      format: (item) => item.name,
    },
  ],
};
