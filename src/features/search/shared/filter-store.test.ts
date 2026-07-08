import { beforeEach, describe, expect, it } from "vitest";
import { useFilterStore } from "./filter-store";

describe("filter-store", () => {
  beforeEach(() => {
    useFilterStore.setState({ conditions: [] });
  });

  it("upserts a condition by id", () => {
    useFilterStore.getState().upsertCondition({
      id: "status",
      fieldKey: "status",
      operator: "eq",
      value: "active",
    });

    useFilterStore.getState().upsertCondition({
      id: "status",
      fieldKey: "status",
      operator: "eq",
      value: "leave",
    });

    expect(useFilterStore.getState().conditions).toEqual([
      {
        id: "status",
        fieldKey: "status",
        operator: "eq",
        value: "leave",
      },
    ]);
  });

  it("removes and clears conditions", () => {
    const store = useFilterStore.getState();

    store.upsertCondition({
      id: "status",
      fieldKey: "status",
      operator: "eq",
      value: "active",
    });

    store.upsertCondition({
      id: "semester",
      fieldKey: "semester",
      operator: "gte",
      value: 5,
    });

    useFilterStore.getState().removeCondition("status");
    expect(useFilterStore.getState().conditions).toEqual([
      {
        id: "semester",
        fieldKey: "semester",
        operator: "gte",
        value: 5,
      },
    ]);

    useFilterStore.getState().clear();
    expect(useFilterStore.getState().conditions).toEqual([]);
  });
});