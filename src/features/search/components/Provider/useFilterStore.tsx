import { useContext } from "react";
import { useStore } from "zustand";
import { FilterStore } from "./filterStore";
import { FilterContext } from "./FilterProvider";

export function useFilterStoreProvider<T>(selector: (state: FilterStore) => T) {
  const store = useContext(FilterContext);

  if (!store) throw new Error("Provider doesn't exist. Please wrap your component with <FilterProvider>.");

  return useStore(store, selector);
}
