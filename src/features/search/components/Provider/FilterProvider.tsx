"use client";

import { createContext, PropsWithChildren, useRef } from "react";
import { createFilterStore, FilterStore } from "../../shared/filter-store";
import { StoreApi } from "zustand";

export const FilterContext = createContext<StoreApi<FilterStore> | null>(null);

export function FilterProvider({ children }: PropsWithChildren) {
  const storeRef = useRef<StoreApi<FilterStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createFilterStore();
  }

  return (
    <FilterContext.Provider value={storeRef.current}>
      {children}
    </FilterContext.Provider>
  );
}
