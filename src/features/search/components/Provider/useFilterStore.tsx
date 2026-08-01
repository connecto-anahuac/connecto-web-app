import { useContext, useMemo } from "react";
import { useStore } from "zustand";
import type { FilterCondition, SearchQuery } from "../../shared/filterDefinition";
import {
  getSearchQuery,
  type SearchScopeId,
} from "./filterStore";
import { FilterContext, FilterScopeContext } from "./FilterProvider";

function useFilterContext() {
  const store = useContext(FilterContext);

  if (!store) {
    throw new Error(
      "Search store doesn't exist. Please wrap your application with <DataSearchRootProvider>.",
    );
  }

  return store;
}

function useSearchStoreContext(): {
  scopeId: SearchScopeId;
  store: ReturnType<typeof useFilterContext>;
} {
  const store = useFilterContext();
  const scopeId = useContext(FilterScopeContext);

  if (!scopeId) {
    throw new Error(
      "Search scope doesn't exist. Please wrap your component with <DataSearchProvider> or <DataSearchScopeProvider>.",
    );
  }

  return { scopeId, store };
}


//detail
export function useDataSearchQuery(): SearchQuery {
  const { scopeId, store } = useSearchStoreContext();
  return useStore(store, (state) => getSearchQuery(state, scopeId));
}

// detail
export function useDataSearchActions() {
  const { scopeId, store } = useSearchStoreContext();

  return useMemo(() => {
    const commands = store.getState();
    return {
      setSearchText: (text: string) => commands.setSearchText(scopeId, text),
      setConditions: (conditions: FilterCondition[]) =>
        commands.setConditions(scopeId, conditions),
      upsertCondition: (condition: FilterCondition) =>
        commands.upsertCondition(scopeId, condition),
      removeCondition: (columnId: string) =>
        commands.removeCondition(scopeId, columnId),
      clear: () => commands.clearScope(scopeId),
      getConditionByKey: (fieldKey: string) =>
        store.getState().getConditionByKey(scopeId, fieldKey),
    };
  }, [scopeId, store]);
}
