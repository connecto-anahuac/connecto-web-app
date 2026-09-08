"use client";

import { createElement } from "react";
import Avator from "@/shared/component/primitive/Avator";
import Badge from "@/shared/component/primitive/Badge";
import { useTable, type DataTableCellRenderers } from "@/shared/component/composite/table/hooks/useTable";
import { useDataSearchActions, useDataSearchQuery } from "@/shared/store/filter/useFilterStore";
import type { ProfessorCollectionItem } from "../../../types/professor";
import { PROFESSOR_COLLECTION_VIEW_CONFIG, type ProfessorCollectionFieldId } from "./professorCollectionViewConfig";
import { ProfessorCollectionDto } from "@/external/dto/professor/professor.dto";
import { GetItemId } from "@/shared/service/dataPipeline/filterDefinition";

const cellRenderers = {
  name: ({ row }) => createElement("div", { className: "flex min-w-0 items-center gap-2" },
    createElement(Avator, { fullName: row.original.name, size: "medium", className: "bg-Primary" }),
    createElement("span", { className: "truncate" }, row.original.name)),
  status: ({ row }) => {
    const active = row.original.status.toLowerCase() === "active" || row.original.status.toLowerCase() === "activo";
    return createElement(Badge, { value: row.original.status, className: active ? "bg-StatusGood text-OnStatusGood" : "bg-DividerMiddle text-OnSurfaceVariant" });
  },
} satisfies DataTableCellRenderers<ProfessorCollectionItem, ProfessorCollectionFieldId>;


const getStudentGradeRowId: GetItemId<ProfessorCollectionDto> = (row) => row.id;
export function useProfessorCollectionTable(data: readonly ProfessorCollectionItem[]) {
  const query = useDataSearchQuery();
  const { setConditions, setSearchText } = useDataSearchActions();
  return {
    config: PROFESSOR_COLLECTION_VIEW_CONFIG,
    ...useTable({ config: PROFESSOR_COLLECTION_VIEW_CONFIG, data, getRowId: getStudentGradeRowId, query, setConditions, setSearchText, cellRenderers }),
  };
}
