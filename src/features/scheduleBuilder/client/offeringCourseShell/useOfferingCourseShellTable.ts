"use client";

import { useMemo } from "react";
import {
  SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS,
  SCHEDULE_BUILDER_OFFERING_COURSE_VIEW_CONFIG,
  type ScheduleBuilderOfferingCourse,
  type ScheduleBuilderOfferingCourseFilterKey,
} from "./scheduleBuilderOfferingCourse";
import { useTable } from "@/shared/component/composite/table/hooks/useTable";
import type { GetItemId } from "@/shared/service/dataPipeline/filterDefinition";
import {
  getFilterPresetNextCondition,
  isFilterPresetSelected,
  type FilterPreset,
  type FilterPresetConfig,
} from "@/shared/service/dataPipeline/filterPreset.type";
import {
  useDataSearchActions,
  useDataSearchQuery,
} from "@/shared/store/filter/useFilterStore";

const getOfferingCourseRowId: GetItemId<ScheduleBuilderOfferingCourse> = (course) =>
  course.key;

export function createRecommendedSemesterPresetConfigs(
  offeringCourses: readonly ScheduleBuilderOfferingCourse[],
): FilterPresetConfig<ScheduleBuilderOfferingCourseFilterKey>[] {
  return [...new Set(offeringCourses.map((course) => course.semester))]
    .sort((left, right) => left - right)
    .map((semester) => ({
      label: `Sem. ${semester}`,
      filterKey: SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.semester,
      conditionValue: semester,
      operator: "eq",
    }));
}

export function useOfferingCourseShellTable(
  offeringCourses: readonly ScheduleBuilderOfferingCourse[],
) {
  const query = useDataSearchQuery();
  const {
    removeCondition,
    setConditions,
    setSearchText,
    upsertCondition,
  } = useDataSearchActions();
  const { globalFilter, metadata, setGlobalFilter, table } = useTable({
    config: SCHEDULE_BUILDER_OFFERING_COURSE_VIEW_CONFIG,
    data: offeringCourses,
    getRowId: getOfferingCourseRowId,
    query,
    setConditions,
    setSearchText,
  });

  const presetConfigs = useMemo(
    () => createRecommendedSemesterPresetConfigs(offeringCourses),
    [offeringCourses],
  );

  const presets: FilterPreset[] = presetConfigs.map((preset) => ({
    label: preset.label,
    isSelected: isFilterPresetSelected(preset, query.conditions),
    onToggle: () => {
      const nextCondition = getFilterPresetNextCondition(
        preset,
        query.conditions,
      );
      if (nextCondition) {
        upsertCondition(nextCondition);
      } else {
        removeCondition(preset.filterKey);
      }
    },
  }));

  return {
    config: SCHEDULE_BUILDER_OFFERING_COURSE_VIEW_CONFIG,
    globalFilter,
    metadata,
    presets,
    setGlobalFilter,
    table,
  };
}
