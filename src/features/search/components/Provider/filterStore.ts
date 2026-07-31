import { createStore } from "zustand/vanilla";
import type { FilterCondition, SearchQuery } from "../../shared/filterDefinition";

export type SearchScopeId = string;

export type FilterState = {
  queriesByScope: Record<SearchScopeId, SearchQuery>;
};

export type FilterCommands = {
  setSearchText: (scopeId: SearchScopeId, text: string) => void;
  setConditions: (
    scopeId: SearchScopeId,
    conditions: FilterCondition[],
  ) => void;
  upsertCondition: (
    scopeId: SearchScopeId,
    condition: FilterCondition,
  ) => void;
  removeCondition: (scopeId: SearchScopeId, columnId: string) => void;
  clearScope: (scopeId: SearchScopeId) => void;
  getConditionByKey: (
    scopeId: SearchScopeId,
    fieldKey: string,
  ) => FilterCondition | undefined;
};

export type FilterStore = FilterState & FilterCommands;

export const EMPTY_SEARCH_QUERY: SearchQuery = {
  text: "",
  conditions: [],
};

export function getSearchQuery(
  state: FilterState,
  scopeId: SearchScopeId,
): SearchQuery {
  return state.queriesByScope[scopeId] ?? EMPTY_SEARCH_QUERY;
}

function setScopedQuery(
  state: FilterState,
  scopeId: SearchScopeId,
  query: SearchQuery,
): FilterState {
  return {
    queriesByScope: {
      ...state.queriesByScope,
      [scopeId]: query,
    },
  };
}

export function createFilterStore() {
  return createStore<FilterStore>((set, get) => ({
    queriesByScope: {},
    setSearchText: (scopeId, text) =>
      set((state) => {
        const query = getSearchQuery(state, scopeId);
        return setScopedQuery(state, scopeId, { ...query, text });
      }),
    setConditions: (scopeId, conditions) =>
      set((state) => {
        const query = getSearchQuery(state, scopeId);
        return setScopedQuery(state, scopeId, { ...query, conditions });
      }),
    upsertCondition: (scopeId, condition) =>
      set((state) => {
        const query = getSearchQuery(state, scopeId);
        const conditions = query.conditions.some(
          (current) => current.columnId === condition.columnId,
        )
          ? query.conditions.map((current) =>
              current.columnId === condition.columnId ? condition : current,
            )
          : [...query.conditions, condition];
        return setScopedQuery(state, scopeId, { ...query, conditions });
      }),
    removeCondition: (scopeId, columnId) =>
      set((state) => {
        const query = getSearchQuery(state, scopeId);
        return setScopedQuery(state, scopeId, {
          ...query,
          conditions: query.conditions.filter(
            (condition) => condition.columnId !== columnId,
          ),
        });
      }),
    clearScope: (scopeId) =>
      set((state) => setScopedQuery(state, scopeId, EMPTY_SEARCH_QUERY)),
    getConditionByKey: (scopeId, fieldKey) =>
      getSearchQuery(get(), scopeId).conditions.find(
        (condition) => condition.columnId === fieldKey,
      ),
  }));
}
