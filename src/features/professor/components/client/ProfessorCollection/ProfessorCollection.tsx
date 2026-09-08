"use client";

import type { ReactNode } from "react";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import { DataTableWithPreview } from "@/shared/component/composite/table/DataTableWithPreview";
import { useProfessorCollection } from "./useProfessorCollection";
import { useProfessorCollectionTable } from "./useProfessorCollectionTable";

type Props = {
  activeProfessorId?: string;
  period?: string;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onPreviewClose: () => void;
  renderPreview: (id: string) => ReactNode;
};

export function ProfessorCollection({ activeProfessorId, period, onSelect, onOpen, onPreviewClose, renderPreview }: Props) {
  const { data, errorMessage, loading } = useProfessorCollection(period);
  const { config, table } = useProfessorCollectionTable(data);

  if (loading) return <div role="status">Cargando profesores...</div>;
  if (errorMessage) return <div role="alert">{errorMessage}</div>;
  if (data.length === 0) return <div><ContentTitleSection title="Profesores" /><p>No hay profesores.</p></div>;

  return (
    <div className="h-full w-full">
      <ContentTitleSection title="Profesores" />
      <DataTableWithPreview
        config={config}
        table={table}
        selectedRowId={activeProfessorId}
        getRowId={(item) => item.id}
        onRowSelect={onSelect}
        onRowOpen={onOpen}
        onPreviewClose={onPreviewClose}
        renderPreview={renderPreview}
        previewAriaLabel="Vista previa del profesor"
        openDetailAriaLabel="Abrir detalle del profesor"
        closePreviewAriaLabel="Cerrar vista previa del profesor"
      />
    </div>
  );
}
