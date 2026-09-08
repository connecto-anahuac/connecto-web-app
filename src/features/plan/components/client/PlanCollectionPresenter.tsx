import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";
import type { StudyPlanCollectionDto } from "@/external/dto/study-plan/study-plan.dto";
import { DataTableWithPreview } from "@/shared/component/composite/table/DataTableWithPreview";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import type { DataViewConfig } from "@/shared/types/dataView.types";

type Props = {
  activeId?: string;
  data: readonly StudyPlanCollectionDto[];
  error: boolean;
  loading: boolean;
  table: Table<StudyPlanCollectionDto>;
  config: DataViewConfig<StudyPlanCollectionDto>;
  onClose: () => void;
  onOpen: (id: string) => void;
  onSelect: (id: string) => void;
  renderPreview: (id: string) => ReactNode;
};

export function PlanCollectionPresenter({ activeId, config, data, error, loading, onClose, onOpen, onSelect, renderPreview, table }: Props) {
  if (loading) return <div role="status">Cargando planes de estudio...</div>;
  if (error) return <div role="alert">No se pudieron cargar los planes de estudio.</div>;
  return <div className="flex h-full w-full flex-col gap-3">
    <ContentTitleSection title="Planes de estudio" />
    {data.length === 0 ? <div>No hay planes de estudio registrados.</div> : <DataTableWithPreview
      config={config} table={table} selectedRowId={activeId} getRowId={(item) => item.id}
      onRowSelect={onSelect} onRowOpen={onOpen} onPreviewClose={onClose} renderPreview={renderPreview}
      previewAriaLabel="Vista previa del plan de estudios" openDetailAriaLabel="Abrir detalle del plan de estudios" closePreviewAriaLabel="Cerrar vista previa del plan de estudios"
    />}
  </div>;
}
