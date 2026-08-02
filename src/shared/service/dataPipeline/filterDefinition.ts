import type { Operator } from "./operatorPolicy";

export type { DataFieldValueType as ValueType } from "@/shared/types/dataView.types";

export type FilterPrimitive = string | number | boolean;

export function defineFilterPrimitive(
  value: unknown,
): value is FilterPrimitive {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

export type FilterRangeValue = [FilterPrimitive, FilterPrimitive];
export type FilterConditionValue =
  | FilterPrimitive
  | FilterPrimitive[]
  | FilterRangeValue
  | null;

// canonical :「正準」「標準形」「唯一の正しい表現」
/** Values stored in queries and used by engines. Labels never enter this type. */
export type CanonicalValue = FilterPrimitive;
// "2026/07/31"
// "2026-7-31"    -> "20260731"  Standardize the format
// "31 Jul 2026"

export type FilterCondition = {
  fieldId: string;
  operator: Operator;
  value: FilterConditionValue;
};

export function defineFilterCondition(
  value: unknown,
): value is FilterCondition {
  return (
    typeof value === "object" &&
    value !== null &&
    "columnId" in value &&
    "operator" in value &&
    "value" in value
  );
}

export type SearchQuery = {
  globalTextQuery: string;
  conditions: FilterCondition[];
};

export type SearchMatchKind = "exact" | "prefix" | "partial";

export type SearchHit = {
  fieldId: string;// TODO columinId
  value: string;
  kind: SearchMatchKind;
};

export type CompiledSearchField<TItem> = {
  fieldId: string;
  operators: readonly Operator[];
  /** 計算に用いられる値をitemから取得 accessor経由済み*/
  readCanonicalValue: (item: TItem) => CanonicalValue | CanonicalValue[] | null;
  getSearchText: (item: TItem) => string[];
  normalizeConditionValue: (
    value: FilterConditionValue,
  ) => FilterConditionValue | null;
};

export type CompiledSearchSchema<TItem> = {
  fields: readonly CompiledSearchField<TItem>[];
  byKey: ReadonlyMap<string, CompiledSearchField<TItem>>;
};

export type SearchEvaluationEntry<TItem> = {//TODO ????
  id: string;
  /** Compatibility identifier for existing card/list consumers. */
  listId: string;
  item: TItem;
  filterPass: boolean;
  searchPass: boolean;
  searchHits: readonly SearchHit[];
  filteringScore: number;
  isMatch: boolean;
};


export type SearchPipelineState<TItem> = {
  entries: readonly SearchEvaluationEntry<TItem>[];
};

export type SearchResult<TItem> = {
  entries: readonly SearchEvaluationEntry<TItem>[];//TODO ???
  matchCount: number;
};

export type ItemId = string;

export type MatchState = {
  matched: boolean;
  score?: number;
  reason?: string[];
};

export type FilterResult = {
  matches: Map<ItemId, MatchState>;
};

export type GetItemId<TItem> = (item: TItem) => ItemId;

/**
 * A complete, immutable engine run. Source is input-only; query is state-only;
 * runtime contains compiled/cached field metadata; working is plugin-owned;
 * result is assigned only by finalization.
 */
export type SearchPipelineContext<TItem> = {
  source: readonly TItem[];
  query: Readonly<SearchQuery>;
  runtime: CompiledSearchSchema<TItem>;
  working: SearchPipelineState<TItem>;
  result?: SearchResult<TItem>;
};

export type SearchPipelineStage<TItem> = {
  id: string;
  execute: (context: SearchPipelineContext<TItem>) => SearchPipelineContext<TItem>;
};
