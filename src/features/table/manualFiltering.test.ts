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
import { compileDataViewSchema } from "@/features/search/shared/filterFactory";

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
    const schema = compileDataViewSchema(
      {
        fields: [{
          fieldId: "semester",
          label: "Semester",
          icon: "schedule",
          valueType: "number",
          accessor: (row: Row) => row.semester,
          format: (row: Row) => String(row.semester),
        }],
      },
      rows,
    );
    const filterResult = runFilter(
      rows,
      {
        globalTextQuery: "",
        conditions: [
          {
            // id: "semester",
            fieldId: "semester",
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
