"use client";

import { create } from "zustand";
import type { Option } from "@/components/table/dataView.types";
import { DATA_CACHE_ID } from "@/shared/types/consts";

/** Options grouped by a data-view column ID. */
export type OptionMap = Map<string, readonly Option[]>;

type OptionStore = {
  /** Options grouped by data-set ID, such as `studentGrade` or `student`. */
  optionsById: Map<DATA_CACHE_ID, OptionMap>;
  setOptions: (id: DATA_CACHE_ID, options: OptionMap) => void;
  removeOptions: (id: DATA_CACHE_ID) => void;
  clearOptions: () => void;
};

export const useOptionStore = create<OptionStore>((set) => ({
  optionsById: new Map(),
  setOptions: (id, options) =>
    set((state) => {
      const optionsById = new Map(state.optionsById);
      optionsById.set(id, new Map(options));
      return { optionsById };
    }),
  removeOptions: (id) =>
    set((state) => {
      const optionsById = new Map(state.optionsById);
      optionsById.delete(id);
      return { optionsById };
    }),
  clearOptions: () => set({ optionsById: new Map() }),
}));
