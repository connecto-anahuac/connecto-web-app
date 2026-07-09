import { describe, expect, it } from "vitest";
import { buildFilterDefinition, buildFilterDefinitions } from "./filter-factory";
import { defineFilterField } from "./filter-field";

type Row = {
  name: string;
  semester: number;
  status: string;
};

const rows: Row[] = [
  { name: "Ada", semester: 3, status: "active" },
  { name: "Linus", semester: 5, status: "leave" },
  { name: "Grace", semester: 3, status: "active" },
];

describe("filter-factory", () => {
  it("derives operators and editor from valueType for a free text field", () => {
    const definition = buildFilterDefinition(
      defineFilterField<Row>({
        key: "name",
        label: "Name",
        valueType: "text",
        inputType: "free",
        getValue: (row) => row.name,
      }),
    );

    expect(definition.editor).toBe("text");
    expect(definition.inputType).toBe("free");
    expect(definition.operators).toEqual(["contains", "eq", "in"]);
  });

  it("derives number editor and range operators", () => {
    const definition = buildFilterDefinition(
      defineFilterField<Row>({
        key: "semester",
        label: "Semester",
        valueType: "number",
        inputType: "free",
        getValue: (row) => row.semester,
      }),
    );

    expect(definition.editor).toBe("number");
    expect(definition.operators).toContain("between");
  });

  it("keeps static options for an option field", () => {
    const definition = buildFilterDefinition(
      defineFilterField<Row>({
        key: "status",
        label: "Status",
        valueType: "enum",
        inputType: "option",
        multiple: false,
        getValue: (row) => row.status,
        options: [
          { label: "Active", value: "active" },
          { label: "Leave", value: "leave" },
        ],
      }),
    );

    expect(definition.editor).toBe("select");
    if (definition.inputType !== "option") {
      throw new Error("expected option definition");
    }
    expect(definition.options).toHaveLength(2);
  });

  it("defaults an option field to a multi-select checklist", () => {
    const definition = buildFilterDefinition(
      defineFilterField<Row>({
        key: "status",
        label: "Status",
        valueType: "enum",
        inputType: "option",
        getValue: (row) => row.status,
        options: [{ label: "Active", value: "active" }],
      }),
    );

    expect(definition.editor).toBe("multiSelect");
  });

  it("derives distinct sorted options from the dataset when dynamicOptions is set", () => {
    const definition = buildFilterDefinition(
      defineFilterField<Row>({
        key: "status",
        label: "Status",
        valueType: "enum",
        inputType: "option",
        getValue: (row) => row.status,
        dynamicOptions: true,
      }),
      rows,
    );

    if (definition.inputType !== "option") {
      throw new Error("expected option definition");
    }
    expect(definition.options.map((option) => option.value)).toEqual([
      "active",
      "leave",
    ]);
  });

  it("respects operator overrides", () => {
    const definition = buildFilterDefinition(
      defineFilterField<Row>({
        key: "name",
        label: "Name",
        valueType: "text",
        inputType: "free",
        getValue: (row) => row.name,
        operators: ["contains"],
      }),
    );

    expect(definition.operators).toEqual(["contains"]);
  });

  it("builds multiple definitions", () => {
    const definitions = buildFilterDefinitions(
      [
        defineFilterField<Row>({
          key: "name",
          label: "Name",
          valueType: "text",
          inputType: "free",
          getValue: (row) => row.name,
        }),
        defineFilterField<Row>({
          key: "semester",
          label: "Semester",
          valueType: "number",
          inputType: "free",
          getValue: (row) => row.semester,
        }),
      ],
      rows,
    );

    expect(definitions).toHaveLength(2);
  });
});
