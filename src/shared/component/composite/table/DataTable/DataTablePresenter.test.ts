import type { ReactElement, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { DataViewConfig } from "@/shared/types/dataView.types";
import {
  DataTablePresenter,
  getFormattedCellTitle,
} from "./DataTablePresenter";

type Row = { name: string };
type ElementProps = {
  "aria-selected"?: boolean;
  className?: string;
  children?: ReactNode;
  onClick?: (event: { target: EventTarget }) => void;
  onDoubleClick?: (event: { target: EventTarget }) => void;
  onKeyDown?: (event: {
    key: string;
    preventDefault: () => void;
    target: EventTarget;
  }) => void;
  role?: string;
  tabIndex?: number;
};

const config: DataViewConfig<Row, "name"> = {
  fields: [
    {
      fieldId: "name",
      label: "Name",
      icon: "person",
      valueType: "text",
      accessor: (row) => row.name,
      format: (row) => `Student: ${row.name}`,
    },
  ],
};

describe("getFormattedCellTitle", () => {
  it("uses the configured text formatter rather than an accessor value", () => {
    expect(getFormattedCellTitle(config, "name", { name: "Ada" })).toBe(
      "Student: Ada",
    );
  });
});

describe("DataTablePresenter row interactions", () => {
  it("calls the preview callback on a plain row click and Enter or Space", () => {
    const onRowClick = vi.fn();
    const row = getRowElement({ onRowClick });
    const target = interactiveTarget(false);

    row.props.onClick?.({ target: target.eventTarget });
    row.props.onKeyDown?.({
      key: "Enter",
      preventDefault: vi.fn(),
      target: target.eventTarget,
    });
    row.props.onKeyDown?.({
      key: " ",
      preventDefault: vi.fn(),
      target: target.eventTarget,
    });

    expect(onRowClick).toHaveBeenCalledTimes(3);
    expect(onRowClick).toHaveBeenNthCalledWith(1, { name: "Ada" }, expect.anything());
  });

  it("calls the detail callback on a row double click", () => {
    const onRowDoubleClick = vi.fn();
    const row = getRowElement({ onRowDoubleClick });

    row.props.onDoubleClick?.({ target: interactiveTarget(false).eventTarget });

    expect(onRowDoubleClick).toHaveBeenCalledWith(
      { name: "Ada" },
      expect.anything(),
    );
  });

  it("does not trigger row interactions from an interactive descendant", () => {
    const onRowClick = vi.fn();
    const onRowDoubleClick = vi.fn();
    const row = getRowElement({ onRowClick, onRowDoubleClick });
    const target = interactiveTarget(true);
    const preventDefault = vi.fn();

    row.props.onClick?.({ target: target.eventTarget });
    row.props.onDoubleClick?.({ target: target.eventTarget });
    row.props.onKeyDown?.({
      key: "Enter",
      preventDefault,
      target: target.eventTarget,
    });

    expect(onRowClick).not.toHaveBeenCalled();
    expect(onRowDoubleClick).not.toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();
    expect(target.closest).toHaveBeenCalledWith(
      'a, button, input, select, textarea, [role="button"], [role="link"], [data-row-interaction="ignore"]',
    );
  });

  it("exposes active selection state and makes interactive rows focusable", () => {
    const activeRow = getRowElement({
      isRowActive: (item) => item.name === "Ada",
      onRowClick: vi.fn(),
    });
    const inactiveRow = getRowElement({ isRowActive: () => false });

    expect(activeRow.props["aria-selected"]).toBe(true);
    expect(activeRow.props.tabIndex).toBe(0);
    expect(inactiveRow.props["aria-selected"]).toBe(false);
    expect(inactiveRow.props.tabIndex).toBeUndefined();
  });

  it("adds the DividerLow hover style only when row hover is enabled", () => {
    const hoverableRow = getRowElement({ isRowHoverable: true });
    const defaultRow = getRowElement({});

    expect(hoverableRow.props.className).toContain("hover:bg-DividerLow");
    expect(defaultRow.props.className).not.toContain("hover:bg-DividerLow");
  });
});

function getRowElement(
  rowProps: Partial<Parameters<typeof DataTablePresenter<Row>>[0]>,
) {
  const element = DataTablePresenter<Row>({
    className: undefined,
    config: { fields: [] },
    focusedResizeColumnId: null,
    hoveredResizeColumnId: null,
    onFilterClose: vi.fn(),
    onFilterToggle: vi.fn(),
    onHide: vi.fn(),
    onMenuOpenChange: vi.fn(),
    onPin: vi.fn(),
    onResize: vi.fn(),
    onResizeFocusChange: vi.fn(),
    onResizeHoverChange: vi.fn(),
    onSort: vi.fn(),
    openFilterId: null,
    openMenuId: null,
    preferredTotal: 0,
    resized: false,
    table: {
      getHeaderGroups: () => [],
      getRowModel: () => ({
        rows: [
          {
            getVisibleCells: () => [],
            id: "ada",
            original: { name: "Ada" },
          },
        ],
      }),
    } as never,
    ...rowProps,
  });

  return findElement(element, (candidate) =>
    candidate.props.role === "row" && candidate.props["aria-selected"] !== undefined,
  );
}

function findElement(
  node: ReactNode,
  predicate: (element: ReactElement<ElementProps>) => boolean,
): ReactElement<ElementProps> {
  if (Array.isArray(node)) {
    for (const child of node) {
      try {
        return findElement(child, predicate);
      } catch {
        // Continue until the row element is found.
      }
    }
  }

  if (typeof node === "object" && node !== null && "props" in node) {
    const element = node as ReactElement<ElementProps>;
    if (predicate(element)) return element;
    const children = element.props.children as ReactNode | undefined;
    if (Array.isArray(children)) {
      for (const child of children) {
        try {
          return findElement(child, predicate);
        } catch {
          // Continue until the row element is found.
        }
      }
    } else if (children !== undefined) {
      return findElement(children, predicate);
    }
  }

  throw new Error("Expected a table row element");
}

function interactiveTarget(ignored: boolean) {
  const closest = vi.fn(() => (ignored ? {} : null));

  return {
    closest,
    eventTarget: { closest } as unknown as EventTarget,
  };
}
