import type {
  CanonicalValue,
  CompiledSearchField,
  SearchPipelineContext,
  SearchEvaluationEntry,
  FilterCondition,
  FilterConditionValue,
  FilterResult,
  FilterPrimitive,
  GetItemId,
  SearchPipelineStage,
  SearchHit,
  SearchMatchKind,
  SearchQuery,
  SearchResult,
} from "./filterDefinition";
import type { Operator } from "./operatorPolicy";
import { removeSpanishAccents } from "../../lib/util";

const SEARCH_SCORES: Record<SearchMatchKind, number> = {
  partial: 1,
  prefix: 2,
  exact: 3,
};

function toListValues(value: CanonicalValue | CanonicalValue[] | null): CanonicalValue[] {
  return value === null ? [] : Array.isArray(value) ? value : [value];
}

function isRangeValue(value: FilterConditionValue): value is [FilterPrimitive, FilterPrimitive] {
  return Array.isArray(value) && value.length === 2 && value.every((entry) => !Array.isArray(entry));
}

function compare(left: CanonicalValue, right: CanonicalValue): number {
  if (typeof left === "number" && typeof right === "number") return left - right;
  if (typeof left === "boolean" && typeof right === "boolean") return Number(left) - Number(right);
  return String(left).localeCompare(String(right));
}

function matchesCanonicalValue(left: CanonicalValue, right: CanonicalValue): boolean {
  return typeof left === "string" && typeof right === "string"
    ? normalizeMatchText(left) === normalizeMatchText(right)
    : left === right;
}

function matchesCondition<TItem>(
  item: TItem,
  condition: FilterCondition,
  filterField: CompiledSearchField<TItem>,
): boolean {
  if (!filterField.operators.includes(condition.operator)) return false;
  const expected = filterField.normalizeConditionValue(condition.value);
  if (expected === null) return false;
  const actual = toListValues(filterField.readCanonicalValue(item));

  switch (condition.operator) {
    case "eq":
      return !Array.isArray(expected) && actual.some((value) => matchesCanonicalValue(value, expected));
    case "in":
      return Array.isArray(expected) && actual.some((value) =>
        expected.some((expectedValue) => matchesCanonicalValue(value, expectedValue)),
      );
    case "contains":
      return !Array.isArray(expected) && actual.some((value) =>
        normalizeMatchText(String(value)).includes(normalizeMatchText(String(expected))),
      );
    case "between": {
      if (!isRangeValue(expected) || actual.length !== 1) return false;
      const actualValue = actual[0]!;
      return compare(actualValue, expected[0]) >= 0 && compare(actualValue, expected[1]) <= 0;
    }
    case "gt":
    case "gte":
    case "lt":
    case "lte": {
      if (Array.isArray(expected) || actual.length !== 1) return false;
      const result = compare(actual[0]!, expected);
      return condition.operator === "gt" ? result > 0 : condition.operator === "gte" ? result >= 0 : condition.operator === "lt" ? result < 0 : result <= 0;
    }
  }
}

function normalizeSearchText(value: string): string {
  return normalizeMatchText(value.trim());
}

function normalizeMatchText(value: string): string {
  return removeSpanishAccents(value).toLocaleLowerCase();
}

function getMatchKind(candidate: string, query: string): SearchMatchKind | null {
  const normalizedCandidate = normalizeSearchText(candidate);
  if (normalizedCandidate === query) return "exact";
  if (normalizedCandidate.startsWith(query)) return "prefix";
  return normalizedCandidate.includes(query) ? "partial" : null;
}

function resolveEntryId<TItem>(item: TItem, index: number): string {
  if (typeof item === "object" && item !== null && "id" in item && typeof (item as { id?: unknown }).id === "string") {
    return (item as { id: string }).id;
  }
  return `search-entry-${index}`;
}

export function createSearchPipelineContext<TItem>(
  source: readonly TItem[],
  query: SearchQuery,
  runtime: SearchPipelineContext<TItem>["runtime"],
): SearchPipelineContext<TItem> {
  return {
    source,
    query,
    runtime,
    working: {
      entries: source.map((item, index) => {
        const id = resolveEntryId(item, index);
        return {
          id,
          listId: id,
          item,
          filterPass: true,
          searchPass: true,
          searchHits: [],
          filteringScore: 0,
          isMatch: true,
        };
      }),
    },
  };
}

export const filterEngine: SearchPipelineStage<unknown> = {
  id: "filter",
  execute: (context) => ({
    ...context,
    working: {
      entries: context.working.entries.map((entry) => ({
        ...entry,
        filterPass: context.query.conditions.every((condition) => {
          const property = context.runtime.byKey.get(condition.fieldId);
          return property ? matchesCondition(entry.item, condition, property) : false;
        }),
      })),
    },
  }),
};

export const searchEngine: SearchPipelineStage<unknown> = {
  id: "search",
  execute: (context) => {
    const query = normalizeSearchText(context.query.globalTextQuery);
    if (!query) return context;
    return {
      ...context,
      working: {
        entries: context.working.entries.map((entry) => {
          const searchHits: SearchHit[] = [];
          for (const property of context.runtime.fields) {
            for (const value of property.getSearchText(entry.item)) {
              const kind = getMatchKind(value, query);
              if (kind) searchHits.push({ fieldId: property.fieldId, value, kind });
            }
          }
          return { ...entry, searchPass: searchHits.length > 0, searchHits };
        }),
      },
    };
  },
};

export const scoreEngine: SearchPipelineStage<unknown> = {
  id: "score",
  execute: (context) => ({
    ...context,
    working: {
      entries: context.working.entries.map((entry) => ({
        ...entry,
        filteringScore: entry.searchHits.reduce(
          (score, hit) => Math.max(score, SEARCH_SCORES[hit.kind]),
          0,
        ),
      })),
    },
  }),
};

export function finalizeEngineContext<TItem>(context: SearchPipelineContext<TItem>): SearchPipelineContext<TItem> {
  const entries = context.working.entries.map((entry) => ({
    ...entry,
    isMatch: entry.filterPass && entry.searchPass,
  }));
  return {
    ...context,
    working: { entries },
    result: { entries, matchCount: entries.filter((entry) => entry.isMatch).length },
  };
}

export function runSearch<TItem>(
  source: readonly TItem[],
  query: SearchQuery,
  runtime: SearchPipelineContext<TItem>["runtime"],
  plugins: readonly SearchPipelineStage<TItem>[] = [
    filterEngine as SearchPipelineStage<TItem>,
    searchEngine as SearchPipelineStage<TItem>,
    scoreEngine as SearchPipelineStage<TItem>,
  ],
): SearchResult<TItem> {
  const context = plugins.reduce(
    (current, plugin) => plugin.execute(current),
    createSearchPipelineContext(source, query, runtime),
  );
  return finalizeEngineContext(context).result!;
}

export function runFilter<TItem>(
  source: readonly TItem[],
  query: SearchQuery,
  runtime: SearchPipelineContext<TItem>["runtime"],
  getRowId: GetItemId<TItem>,
): FilterResult {
  const result = runSearch(source, query, runtime);
  const matches: FilterResult["matches"] = new Map();

  for (const entry of result.entries) {
    const rowId = getRowId(entry.item);
    if (matches.has(rowId)) {
      throw new Error(`Duplicate row id: ${rowId}`);
    }
    matches.set(rowId, { matched: entry.isMatch });
  }

  return { matches };
}

export function selectMatchedRows<TItem>(
  source: readonly TItem[],
  result: FilterResult,
  getRowId: GetItemId<TItem>,
): TItem[] {
  return source.filter(
    (row) => result.matches.get(getRowId(row))?.matched === true,
  );
}

export function selectListEntries<TItem>(result: SearchResult<TItem>): SearchEvaluationEntry<TItem>[] {
  return result.entries.filter((entry) => entry.isMatch);
}

export function selectGridEntries<TItem>(result: SearchResult<TItem>): readonly SearchEvaluationEntry<TItem>[] {
  return result.entries;
}

export function isOperatorAllowed<TItem>(property: CompiledSearchField<TItem>, operator: Operator): boolean {
  return property.operators.includes(operator);
}
