
import { create } from "zustand";
import { FilterState, FilterValue } from "./filter-definition";

export type FilterStore = {
  values: FilterState;

  setValue: (
    key: string,
    value: FilterValue
  ) => void;

  clear: () => void;
};

const useFilterStore =
  create<FilterStore>((set) => ({
    values: {},

    setValue: (key, value) =>
      set((state) => ({
        values: {
          ...state.values,
          [key]: value,
        },
      })),

    clear: () =>
      set({ values: {} }),
  }));