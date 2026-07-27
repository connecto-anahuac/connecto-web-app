"use client";

import { createContext, PropsWithChildren, useState } from "react";
import { createFilterStore, FilterStore } from "./filterStore";
import { StoreApi } from "zustand";

export const FilterContext = createContext<StoreApi<FilterStore> | null>(null);

export function DataSearchProvider({ children }: PropsWithChildren) {
  const [store] = useState(createFilterStore);

  return (
    <FilterContext.Provider value={store}>
      {children}
    </FilterContext.Provider>
  );
}

/** @deprecated Use DataSearchProvider. */
export const FilterProvider = DataSearchProvider;
