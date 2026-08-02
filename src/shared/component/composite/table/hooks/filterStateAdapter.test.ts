import { describe, expect, it } from "vitest";
import type { FilterCondition } from "@/shared/service/dataPipeline/filterDefinition";
import {
  resolveFilterConditionsUpdate,
  toTanstacColumnFiltersState,
  toFilterConditions,
} from "./useTable";

const statusCondition: FilterCondition = {
  fieldId: "status",
  operator: "in",
  value: ["active"],
};

describe("table filter state adapter", () => {
  it("projects independent conditions into TanStack column filters", () => {
    expect(toTanstacColumnFiltersState([statusCondition])).toEqual([
      { id: "status", value: statusCondition },
    ]);
  });

  it("normalizes the TanStack column id as the canonical condition id", () => {
    expect(
      toFilterConditions([
        {
          id: "status",
          value: { ...statusCondition, columnId: "stale-column" },
        },
      ]),
    ).toEqual([statusCondition]);
  });

  it("resolves functional updates used by column.setFilterValue", () => {
    const next = resolveFilterConditionsUpdate(
      (filters) => [
        ...filters,
        {
          id: "semester",
          value: { columnId: "semester", operator: "gte", value: 5 },
        },
      ],
      [statusCondition],
    );

    expect(next).toEqual([
      statusCondition,
      { fieldId: "semester", operator: "gte", value: 5 },
    ]);
  });

  it("removes a condition when TanStack clears its column filter", () => {
    expect(resolveFilterConditionsUpdate(() => [], [statusCondition])).toEqual(
      [],
    );
  });
});
