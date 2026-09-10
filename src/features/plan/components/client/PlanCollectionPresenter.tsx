import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";
import type { StudyPlanCollectionDto } from "@/external/dto/study-plan/study-plan.dto";
import DataSection from "@/shared/component/composite/datasection/DataSection";
import SidePanel from "@/shared/component/composite/sidePanel/SidePanel";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import IconButton from "@/shared/component/primitive/button/IconButton";
import PanelControllButton from "@/shared/component/primitive/button/PanelControllButton";
import type {
  DataViewConfig,
  DataViewMetadata,
} from "@/shared/types/dataView.types";

type Props = {
  activeId?: string;
  data: readonly StudyPlanCollectionDto[];
  error: boolean;
  loading: boolean;
  table: Table<StudyPlanCollectionDto>;
  config: DataViewConfig<StudyPlanCollectionDto>;
  metadata: DataViewMetadata;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onClose: () => void;
  onOpen: (id: string) => void;
  onSelect: (id: string) => void;
  renderPreview: (id: string) => ReactNode;
};

export function PlanCollectionPresenter({
  activeId,
  config,
  data,
  error,
  loading,
  metadata,
  onClose,
  onOpen,
  onSearchTextChange,
  onSelect,
  renderPreview,
  searchText,
  table,
}: Props) {
  if (loading) return <div role="status">Cargando planes de estudio...</div>;
  if (error)
    return <div role="alert">No se pudieron cargar los planes de estudio.</div>;
  return (
    <SidePanel.Root
      className="h-full w-full"
      onPanelChange={(panel) => {
        if (!panel) onClose();
      }}
      panel={activeId ? { id: activeId, type: "plan" } : null}
    >
      <SidePanel.Main className="flex h-full w-full flex-col gap-3">
        <ContentTitleSection title="Planes de estudio" />
        {data.length === 0 ? (
          <div>No hay planes de estudio registrados.</div>
        ) : (
          <DataSection<StudyPlanCollectionDto>
            enableView={["list"]}
            getRowId={(item) => item.id}
            metadata={metadata}
            onRowOpen={onOpen}
            onRowSelect={onSelect}
            onSearchTextChange={onSearchTextChange}
            searchText={searchText}
            selectedRowId={activeId}
            table={table}
            tableConfig={config}
          />
        )}
      </SidePanel.Main>
      <SidePanel.Viewport
        aria-label="Vista previa del plan de estudios"
        className="z-50 flex w-2/5 max-w-2xl flex-col gap-1 overflow-y-auto bg-SurfaceContainerLowest shadow-xl"
      >
        <SidePanel.Content type="plan">
          {(panel) => (
            <>
              <div className="flex justify-between gap-1 p-2">
                <PanelControllButton
                  aria-label="Abrir detalle del plan de estudios"
                  appearance="text"
                  intent="lightInk"
                  isOpen
                  onClick={() => onOpen(panel.id)}
                  size="lg"
                  type="button"
                />
                <IconButton
                  aria-label="Cerrar vista previa del plan de estudios"
                  appearance="text"
                  icon="close"
                  intent="lightInk"
                  onClick={onClose}
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
