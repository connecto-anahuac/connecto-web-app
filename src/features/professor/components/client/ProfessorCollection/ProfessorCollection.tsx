"use client";

import type { ReactNode } from "react";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import IconButton from "@/shared/component/primitive/button/IconButton";
import PanelControllButton from "@/shared/component/primitive/button/PanelControllButton";
import SidePanel from "@/shared/component/composite/sidePanel/SidePanel";
import type { ProfessorCollectionItem } from "@/features/professor/types/professor";
import { useProfessorCollection } from "./useProfessorCollection";
import { useProfessorCollectionTable } from "./useProfessorCollectionTable";
import DataSection from "@/shared/component/composite/datasection/DataSection";

type Props = {
  activeProfessorId?: string;
  period?: string;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onPreviewClose: () => void;
  renderPreview: (id: string) => ReactNode;
};

export function ProfessorCollection({
  activeProfessorId,
  period,
  onSelect,
  onOpen,
  onPreviewClose,
  renderPreview,
}: Props) {
  const { data, errorMessage, loading } = useProfessorCollection(period);
  const {
    config,
    table,
    globalFilter,
    setGlobalFilter,
    metadata,
  } = useProfessorCollectionTable(data);

  if (loading) return <div role="status">Cargando profesores...</div>;
  if (errorMessage) return <div role="alert">{errorMessage}</div>;
  if (data.length === 0)
    return (
      <div>
        <ContentTitleSection title="Profesores" />
        <p>No hay profesores.</p>
      </div>
    );

  return (
    <SidePanel.Root
      className="h-full w-full"
      onPanelChange={(panel) => {
        if (!panel) onPreviewClose();
      }}
      panel={
        activeProfessorId
          ? { id: activeProfessorId, type: "professor" }
          : null
      }
    >
      <SidePanel.Main className="h-full w-full">
        <ContentTitleSection title="Profesores" />
        <DataSection
          enableView={["list"]}
          getRowId={(item) => item.id}
          metadata={metadata}
          onRowOpen={onOpen}
          onRowSelect={onSelect}
          onSearchTextChange={setGlobalFilter}
          searchText={globalFilter}
          selectedRowId={activeProfessorId}
          table={table}
          tableConfig={config}
        />
      </SidePanel.Main>
      <SidePanel.Viewport
        aria-label="Vista previa del profesor"
        className="z-50 flex w-2/5 max-w-2xl flex-col gap-1 overflow-y-auto bg-SurfaceContainerLowest shadow-xl"
      >
        <SidePanel.Content type="professor">
          {(panel) => (
            <>
              <div className="flex justify-between gap-1 p-2">
                <PanelControllButton
                  aria-label="Abrir detalle del profesor"
                  appearance="text"
                  intent="lightInk"
                  isOpen
                  onClick={() => onOpen(panel.id)}
                  size="lg"
                  type="button"
                />
                <IconButton
                  aria-label="Cerrar vista previa del profesor"
                  appearance="text"
                  icon="close"
                  intent="lightInk"
                  onClick={onPreviewClose}
                  size="lg"
                  type="button"
                />
              </div>
              {renderPreview(panel.id)}
            </>
          )}
        </SidePanel.Content>
      </SidePanel.Viewport>
    </SidePanel.Root>
  );
}
