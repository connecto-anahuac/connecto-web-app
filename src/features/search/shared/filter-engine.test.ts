import { describe, expect, it } from "vitest";
import { applyFilters, isOperatorAllowed, matchesCondition } from "./filter-engine";
import { FilterCondition, FilterDefinition } from "./filter-definition";

type StudentSearchItem = {
  name: string;
  semester: number;
  status: string;
  tags: string[];
  enrolledOn: string;
};

const students: StudentSearchItem[] = [
  {
    name: "Alice Johnson",
    semester: 3,
    status: "active",
    tags: ["ios", "lab"],
    enrolledOn: "2024-04-01",
  },
  {
    name: "Bob Smith",
    semester: 7,
    status: "leave",
    tags: ["backend"],
    enrolledOn: "2022-09-15",
  },
  {
    name: "Carla Stone",
    semester: 5,
    status: "active",
    tags: ["frontend", "design"],
    enrolledOn: "2023-04-10",
  },
];

const definitions: FilterDefinition<StudentSearchItem>[] = [
  {
    key: "name",
    label: "Name",
    editor: "text",
    inputType: "free",
    valueType: "text",
    operators: ["eq", "contains"],
    getValue: (item) => item.name,
  },
  {
    key: "semester",
    label: "Semester",
    editor: "number",
    inputType: "free",
    valueType: "number",
    operators: ["eq", "gt", "gte", "lt", "lte", "between"],
    getValue: (item) => item.semester,
  },
  {
    key: "status",
    label: "Status",
    editor: "select",
    inputType: "option",
    valueType: "singleSelect",
    operators: ["eq", "in"],
    getValue: (item) => item.status,
    options: [
      { label: "Active", value: "active" },
      { label: "Leave", value: "leave" },
    ],
  },
  {
    key: "tags",
    label: "Tags",
    editor: "multiSelect",
    inputType: "option",
    valueType: "multiSelect",
    operators: ["in"],
    getValue: (item) => item.tags,
    options: [
      { label: "iOS", value: "ios" },
      { label: "Lab", value: "lab" },
      { label: "Frontend", value: "frontend" },
      { label: "Design", value: "design" },
      { label: "Backend", value: "backend" },
    ],
  },
  {
    key: "enrolledOn",
    label: "Enrolled On",
    editor: "date",
    inputType: "free",
    valueType: "date",
    operators: ["between", "gte", "lte"],
    getValue: (item) => item.enrolledOn,
  },
];

function findDefinition(key: string) {
  const definition = definitions.find((entry) => entry.key === key);
  if (!definition) {
    throw new Error(`Missing definition for ${key}`);
  }

  return definition;
}

describe("filter-engine", () => {
  it("allows only operators declared by the field definition", () => {
    expect(isOperatorAllowed(findDefinition("name"), "contains")).toBe(true);
    expect(isOperatorAllowed(findDefinition("name"), "between")).toBe(false);
  });

  it("matches text contains conditions", () => {
    const condition: FilterCondition = {
      id: "name-contains",
      fieldKey: "name",
      operator: "contains",
      value: "alice",
    };

    expect(matchesCondition(students[0], condition, findDefinition("name"))).toBe(true);
    expect(matchesCondition(students[1], condition, findDefinition("name"))).toBe(false);
  });

  it("matches numeric between conditions", () => {
    const filtered = applyFilters(students, definitions, [
      {
        id: "semester-between",
        fieldKey: "semester",
        operator: "between",
        value: [4, 7],
      },
    ]);

    expect(filtered.map((student) => student.name)).toEqual(["Bob Smith", "Carla Stone"]);
  });

  it("matches select and multi-select conditions with AND semantics", () => {
    const filtered = applyFilters(students, definitions, [
      {
        id: "status-eq",
        fieldKey: "status",
        operator: "eq",
        value: "active",
      },
      {
        id: "tags-in",
        fieldKey: "tags",
        operator: "in",
        value: ["design"],
      },
    ]);

    expect(filtered.map((student) => student.name)).toEqual(["Carla Stone"]);
  });

  it("matches date range conditions using normalized comparable values", () => {
    const filtered = applyFilters(students, definitions, [
      {
        id: "enrolled-between",
        fieldKey: "enrolledOn",
        operator: "between",
        value: ["2023-01-01", "2024-12-31"],
      },
    ]);

    expect(filtered.map((student) => student.name)).toEqual(["Alice Johnson", "Carla Stone"]);
  });
});