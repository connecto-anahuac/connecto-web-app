"use client";

import type { StudyPlanCourseDto } from "@/external/dto/study-plan/study-plan.dto";
import {
  buildPrerequisiteSelection,
  usePrerequisiteSelection,
} from "@/shared/component/composite/diagram/prerequisiteDiagram";
import { useMemo } from "react";

function createPlanPrerequisiteAdapter(
  courses: readonly StudyPlanCourseDto[],
) {
  const coursesByKey = new Map(
    courses.map((course) => [course.courseKey, course]),
  );

  return {
    getId: (course: StudyPlanCourseDto) => course.id,
    getPrerequisites: (course: StudyPlanCourseDto) =>
      course.preRequisites.flatMap((courseKey) => {
        const prerequisite = coursesByKey.get(courseKey);
        return prerequisite ? [prerequisite] : [];
      }),
  };
}

export function buildPlanDiagramSelection(
  selectedId: string | null,
  courses: readonly StudyPlanCourseDto[],
) {
  return buildPrerequisiteSelection(
    selectedId,
    courses,
    createPlanPrerequisiteAdapter(courses),
  );
}

export function usePlanDiagramSelection(
  courses: readonly StudyPlanCourseDto[],
) {
  const adapter = useMemo(
    () => createPlanPrerequisiteAdapter(courses),
    [courses],
  );

  return usePrerequisiteSelection(courses, adapter);
}
