import type { CellContext, ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { DataViewConfig } from "@/shared/types/dataView.types";
import { createTableColumnDefs } from "./useTable";

type Row = { id: string; name: string; status: string };

const config = {
  fields: [
    {
      fieldId: "name",
      label: "Name",
      icon: "person",
      valueType: "text",
      accessor: (row: Row) => row.name,
      format: (row: Row) => `Student: ${row.name}`,
    },
    {
      fieldId: "status",
      label: "Status",
      icon: "person",
      valueType: "text",
      accessor: (row: Row) => row.status,
      format: (row: Row) => row.status.toUpperCase(),
    },
  ],
} satisfies DataViewConfig<Row, "name" | "status">;

const row: Row = { id: "1", name: "Ada", status: "active" };

function cellContext(item: Row) {
  return { row: { original: item } } as CellContext<Row, unknown>;
}

function getCellRenderer(
  column: ColumnDef<Row>,
): (context: CellContext<Row, unknown>) => ReactNode {
  if (typeof column.cell !== "function") {
    throw new Error("Expected a cell renderer function");
  }

  return column.cell;
}

function getAccessor(column: ColumnDef<Row>) {
  if (!("accessorFn" in column) || typeof column.accessorFn !== "function") {
    throw new Error("Expected an accessor function");
  }

  return column.accessorFn;
}

describe("createTableColumnDefs", () => {
  it("uses a supplied renderer while retaining the data accessor", () => {
    const renderName = vi.fn(() => <div>Rich Ada</div>);
    const [nameColumn] = createTableColumnDefs(config, { name: renderName });

    expect(getAccessor(nameColumn)(row, 0)).toBe("Ada");
    expect(getCellRenderer(nameColumn)(cellContext(row))).toEqual(
      <div>Rich Ada</div>,
    );
    expect(renderName).toHaveBeenCalledWith(cellContext(row));
  });

  it("renders formatted text in columns without a renderer", () => {
    const [, statusColumn] = createTableColumnDefs(config);
    const result = getCellRenderer(statusColumn)(cellContext(row));

    expect(result).toMatchObject({
      props: { children: "ACTIVE", className: expect.stringContaining("truncate") },
    });
  });
});
