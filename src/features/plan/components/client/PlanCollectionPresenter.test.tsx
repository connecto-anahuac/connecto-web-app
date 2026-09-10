import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PlanCollectionPresenter } from "./PlanCollectionPresenter";

let dataSectionProps: Record<string, unknown> | undefined;

vi.mock("@/shared/component/composite/datasection/DataSection", () => ({
  default: (props: Record<string, unknown>) => {
    dataSectionProps = props;
    return <div data-testid="plan-collection-table" />;
  },
}));

describe("PlanCollectionPresenter", () => {
  it("renders loading, error, and empty states without the collection table", () => {
    expect(render({ loading: true })).toContain(
      "Cargando planes de estudio...",
    );
    expect(render({ error: true })).toContain(
      "No se pudieron cargar los planes de estudio.",
    );
    expect(render()).toContain("No hay planes de estudio registrados.");
  });

  it("renders the preview in SidePanel and passes only table behavior to DataSection", () => {
    const onClose = vi.fn();
    const onOpen = vi.fn();
    const onSearchTextChange = vi.fn();
    const onSelect = vi.fn();
    const renderPreview = vi.fn(() => <div>Plan preview</div>);

    const markup = render({
      activeId: "plan-1",
      data: [{ id: "plan-1" }],
      onClose,
      onOpen,
      onSearchTextChange,
      onSelect,
      renderPreview,
      searchText: "engineering",
    });

    expect(markup).toContain("plan-collection-table");
    const props = dataSectionProps as {
      enableView: string[];
      getRowId: (item: { id: string }) => string;
      listDiagram?: ReactNode;
      metadata: unknown;
      onRowOpen: (id: string) => void;
      onRowSelect: (id: string) => void;
      onSearchTextChange: (value: string) => void;
      searchText: string;
      selectedRowId: string;
      table: unknown;
      tableConfig: unknown;
    };

    props.onRowSelect("plan-1");
    props.onRowOpen("plan-1");
    props.onSearchTextChange("science");

    expect(markup).toContain('aria-label="Vista previa del plan de estudios"');
    expect(markup).toContain('aria-label="Abrir detalle del plan de estudios"');
    expect(markup).toContain('aria-label="Cerrar vista previa del plan de estudios"');
    expect(markup).toContain("Plan preview");
    expect(props.enableView).toEqual(["list"]);
    expect(props.getRowId({ id: "plan-1" })).toBe("plan-1");
    expect(props.listDiagram).toBeUndefined();
    expect(props.metadata).toBeDefined();
    expect(props.searchText).toBe("engineering");
    expect(props.selectedRowId).toBe("plan-1");
    expect(props.table).toBeDefined();
    expect(props.tableConfig).toBeDefined();
    expect(props).not.toHaveProperty("renderPreview");
    expect(props).not.toHaveProperty("onPreviewClose");
    expect(onSelect).toHaveBeenCalledWith("plan-1");
    expect(onOpen).toHaveBeenCalledWith("plan-1");
    expect(onClose).not.toHaveBeenCalled();
    expect(onSearchTextChange).toHaveBeenCalledWith("science");
    expect(renderPreview).toHaveBeenCalledWith("plan-1");
  });
});

function render({
  activeId,
  data = [],
  error = false,
  loading = false,
  onClose = () => undefined,
  onOpen = () => undefined,
  onSearchTextChange = () => undefined,
  onSelect = () => undefined,
  renderPreview = () => null,
  searchText = "",
}: {
  activeId?: string;
  data?: Array<{ id: string }>;
  error?: boolean;
  loading?: boolean;
  onClose?: () => void;
  onOpen?: (id: string) => void;
  onSearchTextChange?: (value: string) => void;
  onSelect?: (id: string) => void;
  renderPreview?: (id: string) => ReactNode;
  searchText?: string;
} = {}) {
  return renderToStaticMarkup(
    <PlanCollectionPresenter
      activeId={activeId}
      config={{ fields: [] }}
      data={data as never}
      error={error}
      loading={loading}
      metadata={{} as never}
      onClose={onClose}
      onOpen={onOpen}
      onSearchTextChange={onSearchTextChange}
      onSelect={onSelect}
      renderPreview={renderPreview}
      searchText={searchText}
      table={{} as never}
    />,
  );
}
