"use client";

import { createElement } from "react";
import {
  useDataSearchActions,
  useDataSearchQuery,
} from "@/shared/store/filter/useFilterStore";
import type {
  FilterCondition,
  GetItemId,
} from "@/shared/service/dataPipeline/filterDefinition";
import type { FilterPreset } from "@/shared/service/dataPipeline/filterPreset.type";
import Avator from "@/shared/component/primitive/Avator";
import Badge from "@/shared/component/primitive/Badge";
import {
  useTable,
  type DataTableCellRenderers,
} from "@/shared/component/composite/table/hooks/useTable";
import { StudentStatus } from "@/shared/types/consts";
import { STUDENT_AVATAR_COLOR_PALETTE } from "../../ui/studentSummaryPanel/studentSummary.constant";
import { StudentCollectionItem } from "./studentCollection.type";
import {
  STUDENT_COLLECTION_PRESETS,
  STUDENT_COLLECTION_VIEW_CONFIG,
  type StudentCollectionFieldId,
} from "./studentClassViewConfig";

const getStudentCollectionRowId: GetItemId<StudentCollectionItem> = (row) => row.studentId;

export const STUDENT_COLLECTION_CELL_RENDERERS = {
  name: ({ row }) => {
    const student = row.original;
    const avatarColor =
      STUDENT_AVATAR_COLOR_PALETTE[
        student.avatarColorRef % STUDENT_AVATAR_COLOR_PALETTE.length
      ] ?? STUDENT_AVATAR_COLOR_PALETTE[0];

    return createElement(
      "div",
      { className: "flex min-w-0 items-center gap-2" },
      createElement(Avator, {
        fullName: student.name,
        size: "medium",
        style: { backgroundColor: `var(${avatarColor})` },
      }),
      createElement("span", { className: "truncate" }, student.name),
    );
  },
  status: ({ row }) => {
    const status = row.original.status;
    const isActive = status === StudentStatus.ACTIVE;

    return createElement(Badge, {
      value: status,
      className: isActive
        ? "bg-StatusGood text-OnStatusGood"
        : "bg-DividerMiddle text-OnSurfaceVariant",
    });
  },
} satisfies DataTableCellRenderers<
  StudentCollectionItem,
  StudentCollectionFieldId
>;

export function useStudentCollectionTable(data: readonly StudentCollectionItem[] ) {
  // const data: readonly StudentCollectionItem[] = []; // Placeholder for actual data, replace with real data source

  const query = useDataSearchQuery();
  const {
    removeCondition,
    setConditions,
    setSearchText,
    upsertCondition,
  } = useDataSearchActions();
  const { globalFilter, setGlobalFilter, table, filterResult, metadata } = useTable({
    config: STUDENT_COLLECTION_VIEW_CONFIG,
    cellRenderers: STUDENT_COLLECTION_CELL_RENDERERS,
    data,
    getRowId: getStudentCollectionRowId,
    query,
    setConditions,
    setSearchText,
  });

  //TODO Preset
  const presets: FilterPreset[] = STUDENT_COLLECTION_PRESETS.map((preset) => {
    const currentFilterValue = query.conditions.find(
      (condition) => condition.fieldId === preset.columnId,
    );
    const selectedFilterValues =
      currentFilterValue?.operator === "in" &&
      Array.isArray(currentFilterValue.value)
        ? currentFilterValue.value
        : [];
    const selected =
      selectedFilterValues.length === preset.value.length &&
      preset.value.every((value) => selectedFilterValues.includes(value));

    return {
      label: preset.label,
      isSelected: selected,
      onToggle: () => {
        if (selected) {
          removeCondition(preset.columnId);
          return;
        }

        upsertCondition({
          fieldId: preset.columnId,
          operator: "in",
          value: [...preset.value],
        } satisfies FilterCondition);
      },
    };
  });

  return {
    config: STUDENT_COLLECTION_VIEW_CONFIG,
    globalFilter,
    presets,
    setGlobalFilter,
    table,
    filterResult,
    metadata,
  };
}
