import { describe, expect, it } from "vitest";
import { matchesCondition } from "./useTable";
import type { FilterCondition } from "./type";

const condition = (filterValue: FilterCondition, actual: unknown, searchValues = [actual]) =>
  matchesCondition({
    actual,
    filterValue,
    searchValues,
    valueType: filterValue.operator === "in" ? "enum" : "number",
  });

describe("matchesCondition", () => {
  it("matches equality and enum membership against canonical values", () => {
    expect(condition({ columnId: "grade", operator: "eq", value: 8 }, 8)).toBe(true);
    expect(condition({ columnId: "status", operator: "in", value: ["passed", "enrollable"] }, "passed")).toBe(true);
    expect(condition({ columnId: "status", operator: "in", value: ["passed"] }, "failed")).toBe(false);
  });

  it("matches text against option labels and search texts", () => {
    expect(
      matchesCondition({
        actual: "lockedByPreRequisites",
        filterValue: { columnId: "status", operator: "contains", value: "prerrequisitos" },
        searchValues: ["lockedByPreRequisites", "Bloqueado por prerrequisitos"],
        valueType: "text",
      }),
    ).toBe(true);
  });

  it.each([
    ["gt", 7, true],
    ["gte", 8, true],
    ["lt", 9, true],
    ["lte", 8, true],
  ] as const)("evaluates %s", (operator, value, expected) => {
    expect(condition({ columnId: "grade", operator, value }, 8)).toBe(expected);
  });

  it("includes both range boundaries", () => {
    expect(condition({ columnId: "grade", operator: "between", value: [6, 8] }, 6)).toBe(true);
    expect(condition({ columnId: "grade", operator: "between", value: [6, 8] }, 8)).toBe(true);
    expect(condition({ columnId: "grade", operator: "between", value: [6, 8] }, 9)).toBe(false);
  });

  it("rejects operators and value shapes that do not match the column policy", () => {
    expect(
      matchesCondition({
        actual: 8,
        filterValue: { columnId: "grade", operator: "contains", value: "8" },
        searchValues: [8],
        valueType: "number",
      }),
    ).toBe(false);
    expect(
      matchesCondition({
        actual: 8,
        filterValue: { columnId: "grade", operator: "between", value: [6] as unknown as [number, number] },
        searchValues: [8],
        valueType: "number",
      }),
    ).toBe(false);
  });
});
