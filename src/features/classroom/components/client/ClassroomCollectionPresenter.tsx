import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";
import type { ClassroomCollectionDto } from "@/external/dto/classroom/classroom.dto";
import { DataTableWithPreview } from "@/shared/component/composite/table/DataTableWithPreview";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import type { DataViewConfig } from "@/shared/types/dataView.types";

type Props = {
  activeId?: string;
  data: readonly ClassroomCollectionDto[];
  error: boolean;
  loading: boolean;
  table: Table<ClassroomCollectionDto>;
  config: DataViewConfig<ClassroomCollectionDto>;
  onClose: () => void;
  onOpen: (id: string) => void;
  onSelect: (id: string) => void;
  renderPreview: (id: string) => ReactNode;
};

export function ClassroomCollectionPresenter({ activeId, config, data, error, loading, onClose, onOpen, onSelect, renderPreview, table }: Props) {
  if (loading) return <div role="status">Cargando aulas...</div>;
  if (error) return <div role="alert">No se pudieron cargar las aulas.</div>;
  return <div className="flex h-full w-full flex-col gap-3">
    <ContentTitleSection title="Aulas" />
    {data.length === 0 ? <div>No hay aulas registradas.</div> : <DataTableWithPreview
      config={config}
      table={table}
      selectedRowId={activeId}
      getRowId={(item) => item.id}
      onRowSelect={onSelect}
      onRowOpen={onOpen}
      onPreviewClose={onClose}
      renderPreview={renderPreview}
      previewAriaLabel="Vista previa del aula"
      openDetailAriaLabel="Abrir detalle del aula"
      closePreviewAriaLabel="Cerrar vista previa del aula"
    />}
  </div>;
}
