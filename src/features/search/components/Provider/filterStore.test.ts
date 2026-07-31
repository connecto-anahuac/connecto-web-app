import { beforeEach, describe, expect, it } from "vitest";
import { createFilterStore, getSearchQuery } from "./filterStore";

describe("filter-store", () => {
  let store: ReturnType<typeof createFilterStore>;

  beforeEach(() => {
    store = createFilterStore();
  });

  it("upserts a condition by column within a scope", () => {
    store.getState().upsertCondition("student:grades:a", {
      columnId: "status",
      operator: "eq",
      value: "active",
    });

    store.getState().upsertCondition("student:grades:a", {
      columnId: "status",
      operator: "eq",
      value: "leave",
    });

    expect(
      getSearchQuery(store.getState(), "student:grades:a").conditions,
    ).toEqual([
      {
        columnId: "status",
        operator: "eq",
        value: "leave",
      },
    ]);
  });

  it("keeps search queries isolated by student", () => {
    store.getState().setSearchText("student:grades:a", "algebra");
    store.getState().setSearchText("student:grades:b", "history");
    store.getState().upsertCondition("student:grades:a", {
      columnId: "semester",
      operator: "gte",
      value: 5,
    });

    expect(getSearchQuery(store.getState(), "student:grades:a")).toEqual({
      text: "algebra",
      conditions: [
        { columnId: "semester", operator: "gte", value: 5 },
      ],
    });
    expect(getSearchQuery(store.getState(), "student:grades:b")).toEqual({
      text: "history",
      conditions: [],
    });
  });

  it("removes and clears only the selected scope", () => {
    store.getState().upsertCondition("student:grades:a", {
      columnId: "status",
      operator: "eq",
      value: "active",
    });
    store.getState().upsertCondition("student:grades:b", {
      columnId: "semester",
      operator: "gte",
      value: 5,
    });

    store.getState().removeCondition("student:grades:a", "status");
    expect(
      getSearchQuery(store.getState(), "student:grades:a").conditions,
    ).toEqual([]);

    store.getState().setSearchText("student:grades:a", "math");
    store.getState().clearScope("student:grades:a");

    expect(getSearchQuery(store.getState(), "student:grades:a")).toEqual({
      text: "",
      conditions: [],
    });
    expect(getSearchQuery(store.getState(), "student:grades:b")).toEqual({
      text: "",
      conditions: [
        { columnId: "semester", operator: "gte", value: 5 },
      ],
    });
  });

  it("returns a stable empty query without inserting a scope", () => {
    expect(getSearchQuery(store.getState(), "student:grades:missing")).toEqual({
      text: "",
      conditions: [],
    });
    expect(store.getState().queriesByScope).toEqual({});
  });
});
