import type { ReactElement, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "@/shared/component/composite/table/DataTable";
import { DataTableWithPreview } from "./DataTableWithPreview";

type Item = { id: string };
type ElementProps = Record<string, unknown> & { children?: ReactNode };

describe("DataTableWithPreview", () => {
  it("maps table row interactions and selection to item IDs", () => {
    const onRowSelect = vi.fn();
    const onRowOpen = vi.fn();
    const element = render({ onRowOpen, onRowSelect });
    const table = findElement(element, (candidate) => candidate.type === DataTable);

    (table.props.onRowClick as (item: Item) => void)({ id: "ada" });
    (table.props.onRowDoubleClick as (item: Item) => void)({ id: "ada" });

    expect(onRowSelect).toHaveBeenCalledWith("ada");
    expect(onRowOpen).toHaveBeenCalledWith("ada");
    expect((table.props.isRowActive as (item: Item) => boolean)({ id: "ada" })).toBe(true);
    expect((table.props.isRowActive as (item: Item) => boolean)({ id: "grace" })).toBe(false);
  });

  it("shows the selected preview and delegates its open and close controls", () => {
    const onPreviewClose = vi.fn();
    const onRowOpen = vi.fn();
    const renderPreview = vi.fn((id: string) => <p>Preview: {id}</p>);
    const element = render({ onPreviewClose, onRowOpen, renderPreview });
    const aside = findElement(element, (candidate) => candidate.type === "aside");
    const controls = aside.props.children as ReactElement<ElementProps>[];
    const controlBar = controls[0];
    const buttons = controlBar.props.children as ReactElement<ElementProps>[];

    expect(aside.props["aria-label"]).toBe("Item preview");
    expect(renderPreview).toHaveBeenCalledWith("ada");
    (buttons[0].props.onClick as () => void)();
    (buttons[1].props.onClick as () => void)();

    expect(onRowOpen).toHaveBeenCalledWith("ada");
    expect(onPreviewClose).toHaveBeenCalledOnce();
  });

  it("does not render a preview panel without a selected row", () => {
    const element = render({ selectedRowId: undefined });

    expect(() => findElement(element, (candidate) => candidate.type === "aside")).toThrow(
      "Expected element",
    );
  });
});

function render(overrides: Partial<DataTableWithPreviewPropsForTest> = {}) {
  return DataTableWithPreview<Item>({
    closePreviewAriaLabel: "Close item preview",
    config: {} as never,
    getRowId: (item) => item.id,
    onPreviewClose: vi.fn(),
    onRowOpen: vi.fn(),
    onRowSelect: vi.fn(),
    openDetailAriaLabel: "Open item detail",
    previewAriaLabel: "Item preview",
    renderPreview: (id) => <p>Preview: {id}</p>,
    selectedRowId: "ada",
    table: {} as never,
    ...overrides,
  });
}

type DataTableWithPreviewPropsForTest = Parameters<
  typeof DataTableWithPreview<Item>
>[0];

function findElement(
  node: ReactNode,
  predicate: (element: ReactElement<ElementProps>) => boolean,
): ReactElement<ElementProps> {
  if (Array.isArray(node)) {
    for (const child of node) {
      try {
        return findElement(child, predicate);
      } catch {
        // Continue until a matching element is found.
      }
    }
  }

  if (typeof node === "object" && node !== null && "props" in node) {
    const element = node as ReactElement<ElementProps>;
    if (predicate(element)) return element;

    const children = element.props.children;
    if (children !== undefined) return findElement(children, predicate);
  }

  throw new Error("Expected element");
}
