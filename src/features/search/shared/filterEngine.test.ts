import { describe, expect, it } from "vitest";
import type { DataViewConfig } from "@/components/table/dataView.types";
import {
  runFilter,
  runSearch,
  selectGridEntries,
  selectListEntries,
  selectMatchedRows,
} from "./filterEngine";
import { compileDataViewSchema } from "./filterFactory";
import type { FilterConditionValue } from "./filterDefinition";
import type { Operator } from "./operatorPolicy";

type Student = {
  id: string;
  name: string;
  semester: number;
  status: "active" | "leave";
};

const students: Student[] = [
  { id: "1", name: "Alice Johnson", semester: 3, status: "active" },
  { id: "2", name: "Bob Smith", semester: 7, status: "leave" },
  { id: "3", name: "Carla Stone", semester: 5, status: "active" },
];

const config: DataViewConfig<Student> = {
  fields: [
    {
      fieldId: "name", label: "Name", icon: "person", valueType: "text",
      accessor: (student) => student.name, format: (student) => student.name,
    },
    {
      fieldId: "semester", label: "Semester", icon: "schedule", valueType: "number",
      accessor: (student) => student.semester, format: (student) => String(student.semester),
    },
    {
      fieldId: "status", label: "Status", icon: "status", valueType: "enum",
      accessor: (student) => student.status, format: (student) => student.status,
      options: [
        { value: "active", label: "Aprobado" },
        { value: "leave", label: "Baja" },
      ],
    },
  ],
};

const schema = compileDataViewSchema(config, students);

describe("EngineContext search pipeline", () => {
  it("filters and searches the shared option values", () => {
    const filtered = runSearch(students, {
      globalTextQuery: "aprobado",
      conditions: [{ fieldId: "status", operator: "in", value: ["active"] }],
    }, schema);

    expect(selectListEntries(filtered).map((entry) => entry.item.id)).toEqual(["1", "3"]);
    expect(runSearch(students, { globalTextQuery: "active", conditions: [] }, schema).matchCount).toBe(2);
  });

  it("scores exact, prefix, and partial text matches", () => {
    expect(runSearch(students, { globalTextQuery: "Alice Johnson", conditions: [] }, schema).entries[0]!.filteringScore).toBe(3);
    expect(runSearch(students, { globalTextQuery: "ali", conditions: [] }, schema).entries[0]!.filteringScore).toBe(2);
    expect(runSearch(students, { globalTextQuery: "lice", conditions: [] }, schema).entries[0]!.filteringScore).toBe(1);
  });

  it("keeps every row for grid presentation while list presentation excludes misses", () => {
    const result = runSearch(students, { globalTextQuery: "alice", conditions: [] }, schema);
    expect(selectListEntries(result)).toHaveLength(1);
    expect(selectGridEntries(result)).toHaveLength(3);
    expect(selectGridEntries(result)[1]!.isMatch).toBe(false);
  });

  it("evaluates comparison and inclusive range operators", () => {
    const matchingQueries: { operator: Operator; value: FilterConditionValue }[] = [
      { operator: "eq", value: 3 },
      { operator: "gt", value: 2 },
      { operator: "gte", value: 3 },
      { operator: "lt", value: 4 },
      { operator: "lte", value: 3 },
      { operator: "between", value: [3, 5] },
    ];

    for (const { operator, value } of matchingQueries) {
      const result = runSearch(students, {
        globalTextQuery: "",
        conditions: [{ fieldId: "semester", operator, value }],
      }, schema);
      expect(result.entries[0]!.isMatch).toBe(true);
    }
  });

  it("rejects operators that are not allowed by the column policy", () => {
    const result = runSearch(students, {
      globalTextQuery: "",
      conditions: [{ fieldId: "semester", operator: "contains", value: "3" }],
    }, schema);
    expect(result.matchCount).toBe(0);
  });
});

describe("runFilter", () => {
  it("returns matched state for every stable row id", () => {
    const result = runFilter(
      students,
      {
        globalTextQuery: "stone",
        conditions: [
          { fieldId: "status", operator: "in", value: ["active"] },
          { fieldId: "semester", operator: "gte", value: 5 },
        ],
      },
      schema,
      (student) => student.id,
    );

    expect([...result.matches]).toEqual([
      ["1", { matched: false }],
      ["2", { matched: false }],
      ["3", { matched: true }],
    ]);
    expect(selectMatchedRows(students, result, (student) => student.id)).toEqual([students[2]]);
  });

  it("rejects duplicate row ids", () => {
    expect(() =>
      runFilter(students, { globalTextQuery: "", conditions: [] }, schema, () => "duplicate"),
    ).toThrowError("Duplicate row id: duplicate");
  });
});
