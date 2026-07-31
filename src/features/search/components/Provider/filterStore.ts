import { create } from "zustand";
import type { FilterCondition, SearchQuery } from "../../shared/filterDefinition";

export type FilterState = {
  query: SearchQuery;
  /** Compatibility projection for existing controls. */
  conditions: FilterCondition[];
};

export type FilterCommands = {
  setSearchText: (text: string) => void;
  setConditions: (conditions: FilterCondition[]) => void;
  upsertCondition: (condition: FilterCondition) => void;
  removeCondition: (conditionId: string) => void;
  clear: () => void;
  getConditionByKey: (fieldKey: string) => FilterCondition | undefined;
};

export type FilterStore = FilterState & FilterCommands;

function withConditions(query: SearchQuery, conditions: FilterCondition[]): FilterState {
  return { query: { ...query, conditions }, conditions };
}

export function createFilterStore() {
  return create<FilterStore>((set, get) => ({
    query: { text: "", conditions: [] },
    conditions: [],
    setSearchText: (text) => set((state) => ({ query: { ...state.query, text } })),
    setConditions: (conditions) => set((state) => withConditions(state.query, conditions)),
    upsertCondition: (condition) =>
      set((state) => {
        const conditions = state.conditions.some((current) => current.columnId === condition.columnId)
          ? state.conditions.map((current) => current.columnId === condition.columnId ? condition : current)
          : [...state.conditions, condition];
        return withConditions(state.query, conditions);
      }),
    removeCondition: (conditionId) =>
      set((state) => withConditions(state.query, state.conditions.filter((condition) => condition.columnId !== conditionId))),
    clear: () => set((state) => withConditions({ ...state.query, text: "" }, [])),
    getConditionByKey: (fieldKey) => get().conditions.find((condition) => condition.columnId === fieldKey),
  }));
}
