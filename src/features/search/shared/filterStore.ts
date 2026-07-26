import { create } from "zustand";
import { FilterCondition } from "./filterDefinition";

export type FilterState = {
  conditions: FilterCondition[];
};

export type FilterCommands = {
  setConditions: (conditions: FilterCondition[]) => void;
  upsertCondition: (condition: FilterCondition) => void;
  removeCondition: (conditionId: string) => void;
  clear: () => void;
};

export type FilterStore = FilterState & FilterCommands;

export function createFilterStore() {
  return create<FilterStore>((set) => ({
    conditions: [],

    setConditions: (conditions) => set({ conditions }),

    upsertCondition: (condition) =>
      set((state) => {
        const nextConditions = state.conditions.some(
          (current) => current.id === condition.id,
        )
          ? state.conditions.map((current) =>
              current.id === condition.id ? condition : current,
            )
          : [...state.conditions, condition];

        return {
          conditions: nextConditions,
        };
      }),

    removeCondition: (conditionId) =>
      set((state) => ({
        conditions: state.conditions.filter(
          (condition) => condition.id !== conditionId,
        ),
      })),

    clear: () => set({ conditions: [] }),
  }));
}
