import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DataViewConfig } from "@/shared/types/dataView.types";
import DataSection, { type DataSectionProps } from "./DataSection";

let dataTableProps: Record<string, unknown> | undefined;

vi.mock("../table/DataTable", () => ({
  DataTable: (props: Record<string, unknown>) => {
    dataTableProps = props;
    return <div data-testid="default-table" />;
  },
}));

type Item = { id: string };

const config = { fields: [] } satisfies DataViewConfig<Item>;

describe("DataSection", () => {
  beforeEach(() => {
    dataTableProps = undefined;
  });

  it("prefers a custom list diagram without requiring preview props", () => {
    const markup = renderToStaticMarkup(
      <DataSection<Item>
        listDiagram={<div>Custom list</div>}
        table={createTable()}
        tableConfig={config}
      />,
    );

    expect(markup).toContain("Custom list");
    expect(markup).not.toContain("default-table");
    expect(dataTableProps).toBeUndefined();
  });

  it("renders DataTable directly and maps row interactions to row IDs", () => {
    const onRowOpen = vi.fn();
    const onRowSelect = vi.fn();
    const table = createTable();

    const markup = renderToStaticMarkup(
      <DataSection<Item>
        closePreviewAriaLabel="Close item preview"
        getRowId={(item) => item.id}
        isRowHoverable
        onPreviewClose={vi.fn()}
        onRowOpen={onRowOpen}
        onRowSelect={onRowSelect}
        openDetailAriaLabel="Open item detail"
        previewAriaLabel="Item preview"
        renderPreview={() => <div>Preview</div>}
        table={table}
        tableConfig={config}
      />,
    );

    expect(markup).toContain("default-table");
    expect(dataTableProps).toMatchObject({ config, isRowHoverable: true, table });

    const item = { id: "ada" };
    (dataTableProps?.onRowClick as (row: Item) => void)(item);
    (dataTableProps?.onRowDoubleClick as (row: Item) => void)(item);

    expect(onRowSelect).toHaveBeenCalledWith("ada");
    expect(onRowOpen).toHaveBeenCalledWith("ada");
    expect(
      (dataTableProps?.isRowActive as (row: Item) => boolean)(item),
    ).toBe(false);
  });

  it("does not render an aside in card view", () => {
    const markup = renderToStaticMarkup(
      <DataSection<Item>
        cardDiagram={<div>Card view</div>}
        closePreviewAriaLabel="Close item preview"
        defaultView="card"
        getRowId={(item) => item.id}
        onPreviewClose={vi.fn()}
        onRowOpen={vi.fn()}
        onRowSelect={vi.fn()}
        openDetailAriaLabel="Open item detail"
        previewAriaLabel="Item preview"
        renderPreview={() => <div>Preview</div>}
        selectedRowId="ada"
        table={createTable()}
        tableConfig={config}
      />,
    );

    expect(markup).toContain("Card view");
    expect(markup).not.toContain("default-table");
    expect(markup).not.toContain("<aside");
  });

  it("does not render an aside for a supplied custom list diagram", () => {
    const customProps = {
      listDiagram: <div>Custom list</div>,
      table: createTable(),
      tableConfig: config,
      selectedRowId: "ada",
      onRowOpen: vi.fn(),
      onPreviewClose: vi.fn(),
      renderPreview: () => <div>Preview</div>,
      previewAriaLabel: "Item preview",
    } as unknown as DataSectionProps<Item>;

    const markup = renderToStaticMarkup(<DataSection {...customProps} />);

    expect(markup).toContain("Custom list");
    expect(markup).not.toContain("<aside");
  });
});

function createTable() {
  return {
    getAllLeafColumns: () => [],
    getFilteredRowModel: () => ({ rows: [] }),
    getState: () => ({ sorting: [], columnPinning: {} }),
  } as never;
}
