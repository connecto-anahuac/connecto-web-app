import { describe, expect, it } from "vitest";
import {
  applyFilterMatches,
  applyFilters,
  applyTextSearch,
  isOperatorAllowed,
  matchesCondition,
  toFilterableItems,
} from "./filterEngine";
import { FilterCondition, FilterDefinition } from "./filterDefinition";

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
    icon:"person",
    editor: "text",
    inputType: "free",
    valueType: "text",
    operators: ["eq", "contains"],
    getValue: (item) => item.name,
  },
  {
    key: "semester",
    label: "Semester",
    icon:"person",
    editor: "number",
    inputType: "free",
    valueType: "number",
    operators: ["eq", "gt", "gte", "lt", "lte", "between"],
    getValue: (item) => item.semester,
  },
  {
    key: "status",
    label: "Status",
    icon:"person",
    editor: "select",
    inputType: "option",
    valueType: "enum",
    operators: ["eq", ],
    getValue: (item) => item.status,
    options: [
      { label: "Active", value: "active" },
      { label: "Leave", value: "leave" },
    ],
  },
  {
    key: "tags",
    label: "Tags",
    editor: "enum",
    icon:"person",
    inputType: "option",
    valueType: "enum",
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
    icon:"person",
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

  it("matches different filters with AND semantics", () => {
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

  it("matches in conditions with OR semantics inside the same filter", () => {
    const filtered = applyFilters(students, definitions, [
      {
        id: "tags-in-two-values",
        fieldKey: "tags",
        operator: "in",
        value: ["lab", "design"],
      },
    ]);

    expect(filtered.map((student) => student.name)).toEqual(["Alice Johnson", "Carla Stone"]);
  });

  it("matches in conditions for scalar option values declared as enum", () => {
    const scalarOptionDefinitions: FilterDefinition<StudentSearchItem>[] = [
      {
        key: "status",
        label: "Status",
        editor: "enum",
    icon:"person",
        inputType: "option",
        valueType: "enum",
        operators: ["in"],
        getValue: (item) => item.status,
        options: [
          { label: "Active", value: "active" },
          { label: "Leave", value: "leave" },
        ],
      },
    ];

    const filtered = applyFilters(students, scalarOptionDefinitions, [
      {
        id: "status-in-active",
        fieldKey: "status",
        operator: "in",
        value: ["active"],
      },
    ]);

    expect(filtered.map((student) => student.name)).toEqual(["Alice Johnson", "Carla Stone"]);
  });

  it("returns all items in original order when no conditions are provided", () => {
    const filtered = applyFilters(students, definitions, []);

    expect(filtered.map((student) => student.name)).toEqual([
      "Alice Johnson",
      "Bob Smith",
      "Carla Stone",
    ]);
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

  it("keeps between conditions working with two-value ranges", () => {
    const filtered = applyFilters(students, definitions, [
      {
        id: "enrolled-between-regression",
        fieldKey: "enrolledOn",
        operator: "between",
        value: ["2023-01-01", "2024-12-31"],
      },
    ]);

    expect(filtered.map((student) => student.name)).toEqual(["Alice Johnson", "Carla Stone"]);
  });

  it("scores exact, prefix, and partial text matches", () => {
    const exactMatches = applyTextSearch(
      toFilterableItems(students),
      definitions,
      "Alice Johnson",
    );
    const prefixMatches = applyTextSearch(
      toFilterableItems(students),
      definitions,
      "ali",
    );
    const partialMatches = applyTextSearch(
      toFilterableItems(students),
      definitions,
      "lice",
    );

    expect(exactMatches[0]).toMatchObject({ isMatch: true, filteringScore: 3 });
    expect(prefixMatches[0]).toMatchObject({ isMatch: true, filteringScore: 2 });
    expect(partialMatches[0]).toMatchObject({ isMatch: true, filteringScore: 1 });
    expect(partialMatches[1]).toMatchObject({ isMatch: false, filteringScore: 0 });
  });

  it("searches option labels but not their internal values", () => {
    const optionDefinitions: FilterDefinition<StudentSearchItem>[] = [
      {
        key: "status",
        label: "Status",
        icon: "person",
        editor: "enum",
        inputType: "option",
        valueType: "enum",
        operators: ["eq"],
        getValue: (item) => item.status,
        options: [{ label: "Aprobado", value: "active" }],
      },
    ];

    const labelMatches = applyTextSearch(
      toFilterableItems(students),
      optionDefinitions,
      "aprobado",
    );
    const valueMatches = applyTextSearch(
      toFilterableItems(students),
      optionDefinitions,
      "active",
    );

    expect(labelMatches[0]).toMatchObject({ isMatch: true, filteringScore: 3 });
    expect(valueMatches[0]).toMatchObject({ isMatch: false, filteringScore: 0 });
  });

  it("combines text search and filter conditions with AND semantics", () => {
    const searchMatches = applyTextSearch(
      toFilterableItems(students),
      definitions,
      "alice",
    );
    const matches = applyFilterMatches(searchMatches, definitions, [
      {
        id: "status-leave",
        fieldKey: "status",
        operator: "eq",
        value: "leave",
      },
    ]);

    expect(matches.every((item) => !item.isMatch)).toBe(true);
    expect(matches[0].filteringScore).toBe(2);
  });

  it("resets search metadata when the pipeline starts from initial items", () => {
    const searchedItems = applyTextSearch(
      toFilterableItems(students),
      definitions,
      "alice",
    );
    const resetItems = applyTextSearch(
      toFilterableItems(students),
      definitions,
      " ",
    );

    expect(searchedItems[1].isMatch).toBe(false);
    expect(resetItems).toEqual(
      toFilterableItems(students),
    );
  });
});
