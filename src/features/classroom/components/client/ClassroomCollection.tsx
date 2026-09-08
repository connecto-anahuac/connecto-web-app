"use client";

import { useLiveQuery } from "dexie-react-hooks";
import type { ClassroomCollectionDto } from "@/external/dto/classroom/classroom.dto";
import { fetchClassroomCollection } from "@/external/handler/classrooms/query.client";
import { useTable } from "@/shared/component/composite/table/hooks/useTable";
import { useDataSearchActions, useDataSearchQuery } from "@/shared/store/filter/useFilterStore";
import type { DataViewConfig } from "@/shared/types/dataView.types";
import { ClassroomDetail } from "./ClassroomDetail";
import { ClassroomCollectionPresenter } from "./ClassroomCollectionPresenter";
import { useClassroomPreviewNavigation } from "./useClassroomPreviewNavigation";
import { GetItemId } from "@/shared/service/dataPipeline/filterDefinition";

const CONFIG = { fields: [
  { fieldId: "id", label: "ID", icon: "hashmark", valueType: "text", accessor: (item) => item.id, format: (item) => item.id },
  { fieldId: "name", label: "Nombre", icon: "door", valueType: "text", accessor: (item) => item.name, format: (item) => item.name },
  { fieldId: "place", label: "Ubicación", icon: "door", valueType: "text", accessor: (item) => item.place, format: (item) => item.place || "--" },
  { fieldId: "note", label: "Nota", icon: "book", valueType: "text", accessor: (item) => item.note, format: (item) => item.note || "--" },
  { fieldId: "equipments", label: "Equipamiento", icon: "toolOutline", valueType: "text", accessor: (item) => item.equipments.join(", "), format: (item) => item.equipments.join(", ") || "--" },
  { fieldId: "admin", label: "Administrador", icon: "admin", valueType: "text", accessor: (item) => item.admin, format: (item) => item.admin || "--" },
] } satisfies DataViewConfig<ClassroomCollectionDto>;


const getStudentGradeRowId: GetItemId<ClassroomCollectionDto> = (row) => row.id;

export function ClassroomCollection({ activeId }: { activeId?: string }) {
  const snapshot = useLiveQuery(async () => {
    try { return { data: await fetchClassroomCollection() } as const; }
    catch (error) { console.error("Failed loading classrooms", error); return { error: true } as const; }
  }, []);
  const query = useDataSearchQuery();
  const { setConditions, setSearchText } = useDataSearchActions();
  const data = snapshot && "data" in snapshot ? snapshot.data ?? [] : [];
  const { table } = useTable({ config: CONFIG, data, getRowId: getStudentGradeRowId, query, setConditions, setSearchText });
  const navigation = useClassroomPreviewNavigation();
  return <ClassroomCollectionPresenter
    activeId={activeId} config={CONFIG} data={data} error={Boolean(snapshot && "error" in snapshot)} loading={!snapshot}
    onClose={navigation.closeClassroomPreview} onOpen={navigation.openClassroomDetail} onSelect={navigation.selectClassroom}
    renderPreview={(id) => <ClassroomDetail className="px-4" classroomId={id} />} table={table}
  />;
}
