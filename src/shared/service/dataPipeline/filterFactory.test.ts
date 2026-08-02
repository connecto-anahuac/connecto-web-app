import { describe, expect, it } from "vitest";
import type { DataViewConfig } from "@/shared/component/composite/table/dataView.types";
import { buildDataViewMetadata } from "@/shared/component/composite/table/buildDataViewMetadata";
import { compileDataViewSchema } from "./filterFactory";

type Row = { name: string; semester: number; status: "active" | "leave" };

const rows: Row[] = [
  { name: "Ada", semester: 3, status: "active" },
  { name: "Linus", semester: 5, status: "leave" },
];

const config: DataViewConfig<Row> = {
  fields: [
    {
      fieldId: "name",
      label: "Name",
      icon: "person",
      valueType: "text",
      accessor: (row) => row.name,
      format: (row) => row.name,
    },
    {
      fieldId: "status",
      label: "Status",
      icon: "status",
      valueType: "enum",
      accessor: (row) => row.status,
      format: (row) => row.status,
      options: [
        { value: "active", label: "Active" },
        { value: "leave", label: "Leave" },
      ],
    },
    {
      fieldId: "hidden",
      label: "Hidden",
      icon: "unvisible",
      valueType: "text",
      accessor: (row) => row.name,
      format: (row) => row.name,
      filterable: false,
    },
  ],
};

describe("compileDataViewSchema", () => {
  it("compiles canonical values, option search values, and conditions", () => {
    const metadata = buildDataViewMetadata(config, rows);
    const schema = compileDataViewSchema(config, rows, metadata);
    const status = schema.byKey.get("status")!;

    expect(status.readCanonicalValue(rows[0]!)).toBe("active");
    expect(status.getSearchText(rows[0]!)).toEqual(
      expect.arrayContaining(["active", "Active"]),
    );
    expect(status.normalizeConditionValue("active")).toBe("active");
  });

  it("excludes columns marked as not filterable", () => {
    const schema = compileDataViewSchema(config, rows);

    expect(schema.byKey.has("hidden")).toBe(false);
  });
});
