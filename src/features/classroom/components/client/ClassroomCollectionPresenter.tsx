import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";
import type { ClassroomCollectionDto } from "@/external/dto/classroom/classroom.dto";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import DataSection from "@/shared/component/composite/datasection/DataSection";
import SidePanel from "@/shared/component/composite/sidePanel/SidePanel";
import IconButton from "@/shared/component/primitive/button/IconButton";
import PanelControllButton from "@/shared/component/primitive/button/PanelControllButton";
import type {
  DataViewConfig,
  DataViewMetadata,
} from "@/shared/types/dataView.types";

type Props = {
  activeId?: string;
  data: readonly ClassroomCollectionDto[];
  error: boolean;
  loading: boolean;
  metadata?: DataViewMetadata;
  onClose: () => void;
  onOpen: (id: string) => void;
  onSearchTextChange?: (value: string) => void;
  onSelect: (id: string) => void;
  renderPreview: (id: string) => ReactNode;
  searchText?: string;
  table: Table<ClassroomCollectionDto>;
  tableConfig: DataViewConfig<ClassroomCollectionDto>;
};

export function ClassroomCollectionPresenter({
  activeId,
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
  tableConfig,
}: Props) {
  if (loading) return <div role="status">Cargando aulas...</div>;
  if (error) return <div role="alert">No se pudieron cargar las aulas.</div>;
  return (
    <SidePanel.Root
      className="h-full w-full"
      onPanelChange={(panel) => {
        if (!panel) onClose();
      }}
      panel={activeId ? { id: activeId, type: "classroom" } : null}
    >
      <SidePanel.Main className="flex h-full w-full flex-col gap-3">
        <ContentTitleSection title="Aulas" />
        {data.length === 0 ? (
          <div>No hay aulas registradas.</div>
        ) : (
          <DataSection<ClassroomCollectionDto>
            enableView={["list"]}
            getRowId={(item) => item.id}
            metadata={metadata}
            onRowOpen={onOpen}
            onRowSelect={onSelect}
            onSearchTextChange={onSearchTextChange}
            searchText={searchText}
            selectedRowId={activeId}
            table={table}
            tableConfig={tableConfig}
          />
        )}
      </SidePanel.Main>
      <SidePanel.Viewport
        aria-label="Vista previa del aula"
        className="z-50 flex w-2/5 max-w-2xl flex-col gap-1 overflow-y-auto bg-SurfaceContainerLowest shadow-xl"
      >
        <SidePanel.Content type="classroom">
          {(panel) => (
            <>
              <div className="flex justify-between gap-1 p-2">
                <PanelControllButton
                  aria-label="Abrir detalle del aula"
                  appearance="text"
                  intent="lightInk"
                  isOpen
                  onClick={() => onOpen(panel.id)}
                  size="lg"
                  type="button"
                />
                <IconButton
                  aria-label="Cerrar vista previa del aula"
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
