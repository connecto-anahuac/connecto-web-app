"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import { createFilterStore, type FilterStore, type SearchScopeId } from "./filterStore";
import type { StoreApi } from "zustand";

export const FilterContext = createContext<StoreApi<FilterStore> | null>(null);
export const FilterScopeContext = createContext<SearchScopeId | null>(null);

export const DEFAULT_SEARCH_SCOPE_ID = "default";

export function DataSearchRootProvider({ children }: PropsWithChildren) {
  const [store] = useState(createFilterStore);

  return (
    <FilterContext.Provider value={store}>{children}</FilterContext.Provider>
  );
}

type ScopeProps = PropsWithChildren<{
  scopeId: SearchScopeId;
}>;

export function DataSearchScopeProvider({ children, scopeId }: ScopeProps) {
  return (
    <FilterScopeContext.Provider value={scopeId}>
      {children}
    </FilterScopeContext.Provider>
  );
}

type DataSearchProviderProps = PropsWithChildren<{
  scopeId?: SearchScopeId;
}>;

/**
 * Backwards-compatible compound provider for isolated widgets and stories.
 * Within the application root it only establishes a search scope.
 */
export function DataSearchProvider({
  children,
  scopeId = DEFAULT_SEARCH_SCOPE_ID,
}: DataSearchProviderProps) {
  const parentStore = useContext(FilterContext);
  const scopedChildren = (
    <DataSearchScopeProvider scopeId={scopeId}>
      {children}
    </DataSearchScopeProvider>
  );

  return parentStore ? (
    scopedChildren
  ) : (
    <DataSearchRootProvider>{scopedChildren}</DataSearchRootProvider>
  );
}

/** @deprecated Use DataSearchProvider. */
export const FilterProvider = DataSearchProvider;
