import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import {
  runFilter,
  selectMatchedRows,
} from "@/features/search/shared/filterEngine";
import { compilePropertySchema } from "@/features/search/shared/filterFactory";
import { defineDataProperty } from "@/features/search/shared/filterField";

type Row = {
  id: string;
  semester: number;
};

const rows: Row[] = [
  { id: "first", semester: 3 },
  { id: "second", semester: 7 },
  { id: "third", semester: 5 },
];

const getRowId = (row: Row) => row.id;

describe("manual table filtering", () => {
  it("passes matched rows to TanStack and keeps its default sorting", () => {
    const schema = compilePropertySchema(
      [
        defineDataProperty<Row>({
          key: "semester",
          label: "Semester",
          icon: "schedule",
          valueType: "number",
          inputType: "free",
          getValue: (row) => row.semester,
        }),
      ],
      rows,
    );
    const filterResult = runFilter(
      rows,
      {
        text: "",
        conditions: [
          {
            // id: "semester",
            columnId: "semester",
            operator: "gte",
            value: 5,
          },
        ],
      },
      schema,
      getRowId,
    );
    const filteredRows = selectMatchedRows(rows, filterResult, getRowId);
    const columns: ColumnDef<Row>[] = [
      { id: "semester", accessorFn: (row) => row.semester },
    ];
    const table = createTable({
      columns,
      data: filteredRows,
      getCoreRowModel: getCoreRowModel(),
      getRowId,
      getSortedRowModel: getSortedRowModel(),
      manualFiltering: true,
      onStateChange: () => undefined,
      renderFallbackValue: null,
      state: {
        sorting: [{ id: "semester", desc: true }],
      },
    });

    expect(table.getRowModel().rows.map((row) => row.original.id)).toEqual([
      "second",
      "third",
    ]);
  });
});
