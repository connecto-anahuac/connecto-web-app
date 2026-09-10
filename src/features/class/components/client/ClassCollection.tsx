"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { DataTable } from "@/shared/component/composite/table/DataTable";
import { useTable } from "@/shared/component/composite/table/hooks/useTable";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import type { CourseCollectionDto } from "@/external/dto/course/course.dto";
import { fetchCourseCollection } from "@/external/handler/courses/query.client";
import {
  useDataSearchActions,
  useDataSearchQuery,
} from "@/shared/store/filter/useFilterStore";
import type { DataViewConfig } from "@/shared/types/dataView.types";
import { GetItemId } from "@/shared/service/dataPipeline/filterDefinition";
import DataSection, { DataSectionProps } from "@/shared/component/composite/datasection/DataSection";

const CLASS_VIEW_CONFIG = {
  fields: [
    {
      fieldId: "keyCode",
      label: "Clave",
      icon: "hashmark",
      valueType: "text",
      accessor: (item) => item.keyCode,
      format: (item) => item.keyCode,
    },
    {
      fieldId: "keyNumber",
      label: "Número",
      icon: "hashmark",
      valueType: "text",
      accessor: (item) => item.keyNumber,
      format: (item) => item.keyNumber,
    },
    {
      fieldId: "name",
      label: "Materia",
      icon: "class",
      valueType: "text",
      accessor: (item) => item.name,
      format: (item) => item.name,
    },
    {
      fieldId: "hours",
      label: "Horas",
      icon: "schedule",
      valueType: "number",
      accessor: (item) => item.hours,
      format: (item) => String(item.hours),
    },
    {
      fieldId: "credits",
      label: "Créditos",
      icon: "schoolHat",
      valueType: "number",
      accessor: (item) => item.credits,
      format: (item) => String(item.credits),
    },
    {
      fieldId: "block",
      label: "Bloque",
      icon: "book",
      valueType: "text",
      accessor: (item) => item.block,
      format: (item) => item.block || "--",
    },
    {
      fieldId: "prerequisito",
      label: "Prerrequisito",
      icon: "curriculum",
      valueType: "text",
      accessor: (item) => item.prerequisito,
      format: (item) => item.prerequisito || "--",
    },
  ],
} satisfies DataViewConfig<CourseCollectionDto>;

const getCourseRowId: GetItemId<CourseCollectionDto> = (row) => row.key;
export function ClassCollection() {

  // TODO hooks 化
  const snapshot = useLiveQuery(async () => {
    try {
      return { data: await fetchCourseCollection() } as const;
    } catch (error) {
      console.error("Failed loading class collection", error);
      return { error: true } as const;
    }
  }, []);
  const query = useDataSearchQuery();
  const { setConditions, setSearchText } = useDataSearchActions();
  const { globalFilter,
    setGlobalFilter,
    table,
    metadata,} = useTable({
    config: CLASS_VIEW_CONFIG,
    data: snapshot && "data" in snapshot ? (snapshot.data ?? []) : [],
    getRowId: getCourseRowId,
    query,
    setConditions,
    setSearchText,
  });

  if (!snapshot) return <div role="status">Cargando materias...</div>;
  if ("error" in snapshot)
    return <div role="alert">No se pudieron cargar las materias.</div>;
  const dataSectionProps = {
    enableView: ["list"],
    searchText: globalFilter,
    onSearchTextChange: setGlobalFilter,
    tableConfig: CLASS_VIEW_CONFIG,
    table: table,
    metadata: metadata,
    listDiagram: <DataTable config={CLASS_VIEW_CONFIG} table={table} />,
  } satisfies DataSectionProps<CourseCollectionDto>;


  return (
    <div className="flex h-full w-full flex-col gap-3">
      <ContentTitleSection title="Materias" />

      <DataSection {...dataSectionProps} />
      {/*  */}



      {/* {(snapshot.data ?? []).length === 0 ? (
        <div>No hay materias registradas.</div>
      ) : (
        <DataTable config={CLASS_VIEW_CONFIG} table={table} />
      )} */}
    </div>
  );
}
