import { describe, expect, it } from "vitest";
import type { FilterCondition } from "./filterDefinition";
import {
  getFilterPresetNextCondition,
  isFilterPresetSelected,
  isSameFilterPresetValue,
  type FilterPresetConfig,
} from "./filterPreset.type";

const failingPreset: FilterPresetConfig<"grade"> = {
  label: "reprobado",
  filterKey: "grade",
  conditionValue: 6,
  operator: "lt",
};

describe("filter presets", () => {
  it("selects a preset when a manually entered condition exactly matches it", () => {
    const conditions: FilterCondition[] = [
      { fieldId: "grade", operator: "lt", value: 6 },
    ];

    expect(isFilterPresetSelected(failingPreset, conditions)).toBe(true);
  });

  it("does not select a preset when the value or operator differs", () => {
    expect(
      isFilterPresetSelected(failingPreset, [
        { fieldId: "grade", operator: "gte", value: 6 },
      ]),
    ).toBe(false);
    expect(
      isFilterPresetSelected(failingPreset, [
        { fieldId: "grade", operator: "lt", value: 5 },
      ]),
    ).toBe(false);
  });

  it("returns a replacement condition for an unselected preset using the same key", () => {
    expect(
      getFilterPresetNextCondition(failingPreset, [
        { fieldId: "grade", operator: "gte", value: 6 },
      ]),
    ).toEqual({ columnId: "grade", operator: "lt", value: 6 });
  });

  it("returns null when toggling an active preset off", () => {
    expect(
      getFilterPresetNextCondition(failingPreset, [
        { fieldId: "grade", operator: "lt", value: 6 },
      ]),
    ).toBeNull();
  });

  it("compares multi-select values without depending on their order", () => {
    expect(isSameFilterPresetValue(["A", "B"], ["B", "A"], "in")).toBe(true);
  });

  it("retains range ordering for between conditions", () => {
    expect(isSameFilterPresetValue([1, 2], [2, 1], "between")).toBe(false);
  });
});
