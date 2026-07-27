import { describe, expect, it } from "vitest";
import { compilePropertySchema } from "./filterFactory";
import { defineDataProperty, type DataPropertyConfig } from "./filterField";

type Row = { name: string; semester: number; status: "active" | "leave" };

const rows: Row[] = [
  { name: "Ada", semester: 3, status: "active" },
  { name: "Linus", semester: 5, status: "leave" },
  { name: "Grace", semester: 3, status: "active" },
];

const properties: DataPropertyConfig<Row>[] = [
  defineDataProperty<Row>({
    key: "name", label: "Name", icon: "person", valueType: "text", inputType: "free",
    getValue: (row) => row.name, search: true,
  }),
  defineDataProperty<Row>({
    key: "status", label: "Status", icon: "status", valueType: "enum", inputType: "option",
    getValue: (row) => row.status, search: true,
    options: [{ value: "active", label: "Active" }, { value: "leave", label: "Leave" }],
  }),
  defineDataProperty<Row>({
    key: "semester", label: "Semester", icon: "schedule", valueType: "number", inputType: "option",
    getValue: (row) => row.semester, dynamicOptions: true, search: false,
  }),
];

describe("compilePropertySchema", () => {
  it("separates canonical values, display values, and search text", () => {
    const schema = compilePropertySchema(properties, rows);
    const status = schema.byKey.get("status")!;

    expect(status.readCanonicalValue(rows[0]!)).toBe("active");
    expect(status.formatDisplayValue(rows[0]!)).toEqual(["Active"]);
    expect(status.getSearchText(rows[0]!)).toEqual(["Active"]);
    expect(status.normalizeConditionValue("active")).toBe("active");
  });

  it("generates dynamic options from canonical values without duplicates", () => {
    const schema = compilePropertySchema(properties, rows);
    expect(schema.byKey.get("semester")!.options).toEqual([
      { value: 3, label: "3" },
      { value: 5, label: "5" },
    ]);
  });
});
