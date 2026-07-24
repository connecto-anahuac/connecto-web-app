


import { beforeEach, describe, expect, it } from "vitest";
import { createFilterStore } from "./filter-store";
import { useFilterStore } from "../components/useFilterStore";

describe("filter-store", () => {
  let store: ReturnType<typeof createFilterStore>;

  beforeEach(() => {
    store = createFilterStore();
    store.setState({ conditions: [] });
  });

  it("upserts a condition by id", () => {
    store.getState().upsertCondition({
      id: "status",
      fieldKey: "status",
      operator: "eq",
      value: "active",
    });

    store.getState().upsertCondition({
      id: "status",
      fieldKey: "status",
      operator: "eq",
      value: "leave",
    });

    expect(store.getState().conditions).toEqual([
      {
        id: "status",
        fieldKey: "status",
        operator: "eq",
        value: "leave",
      },
    ]);
  });

  it("removes and clears conditions", () => {
    // const store = useFilterStore.getState();

    store.getState().upsertCondition({
      id: "status",
      fieldKey: "status",
      operator: "eq",
      value: "active",
    });

    store.getState().upsertCondition({
      id: "semester",
      fieldKey: "semester",
      operator: "gte",
      value: 5,
    });

    store.getState().removeCondition("status");
    expect(store.getState().conditions).toEqual([
      {
        id: "semester",
        fieldKey: "semester",
        operator: "gte",
        value: 5,
      },
    ]);

    store.getState().clear();
    expect(store.getState().conditions).toEqual([]);
  });
});



// import { beforeEach, describe, expect, it } from "vitest";
// import { createFilterStore } from "./filter-store";

// describe("filter-store", () => {
//   beforeEach(() => {
//     createFilterStore.setState({ conditions: [] });
//   });

//   it("upserts a condition by id", () => {
//     createFilterStore.getState().upsertCondition({
//       id: "status",
//       fieldKey: "status",
//       operator: "eq",
//       value: "active",
//     });

//     createFilterStore.getState().upsertCondition({
//       id: "status",
//       fieldKey: "status",
//       operator: "eq",
//       value: "leave",
//     });

//     expect(createFilterStore.getState().conditions).toEqual([
//       {
//         id: "status",
//         fieldKey: "status",
//         operator: "eq",
//         value: "leave",
//       },
//     ]);
//   });

//   it("removes and clears conditions", () => {
//     const store = createFilterStore.getState();

//     store.upsertCondition({
//       id: "status",
//       fieldKey: "status",
//       operator: "eq",
//       value: "active",
//     });

//     store.upsertCondition({
//       id: "semester",
//       fieldKey: "semester",
//       operator: "gte",
//       value: 5,
//     });

//     createFilterStore.getState().removeCondition("status");
//     expect(createFilterStore.getState().conditions).toEqual([
//       {
//         id: "semester",
//         fieldKey: "semester",
//         operator: "gte",
//         value: 5,
//       },
//     ]);

//     createFilterStore.getState().clear();
//     expect(createFilterStore.getState().conditions).toEqual([]);
//   });
// });