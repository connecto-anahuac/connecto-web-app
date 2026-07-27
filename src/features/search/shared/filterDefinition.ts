import type { IconName } from "@/components/icon";
import type { Operator } from "./operatorPolicy";

export const editor = ["text", "number", "select", "multiSelect", "date"] as const;
export type Editor = (typeof editor)[number];

export const valueTypes = ["text", "number", "date", "enum", "boolean"] as const;
export type ValueType = (typeof valueTypes)[number];

export type FilterPrimitive = string | number | boolean;
export type FilterRangeValue = [FilterPrimitive, FilterPrimitive];
export type FilterConditionValue =
  | FilterPrimitive
  | FilterPrimitive[]
  | FilterRangeValue
  | null;

/** Values stored in queries and used by engines. Labels never enter this type. */
export type CanonicalValue = FilterPrimitive;

export type FilterCondition = {
  id: string;
  fieldKey: string;
  operator: Operator;
  value: FilterConditionValue;
};

export type SearchQuery = {
  text: string;
  conditions: FilterCondition[];
};

export type FilterOption = {
  /** Canonical comparison value. */
  value: CanonicalValue;
  /** Human-readable value for controls and text search. */
  label: string;
};

export type SearchMatchKind = "exact" | "prefix" | "partial";

export type SearchHit = {
  fieldKey: string;
  value: string;
  kind: SearchMatchKind;
};

export type CompiledProperty<TItem> = {
  key: string;
  label: string;
  icon: IconName;
  editor: Editor;
  valueType: ValueType;
  inputType: "free" | "option";
  options: readonly FilterOption[];
  operators: readonly Operator[];
  isSearchable: boolean;
  readCanonicalValue: (item: TItem) => CanonicalValue | CanonicalValue[] | null;
  formatDisplayValue: (item: TItem) => string[];
  getSearchText: (item: TItem) => string[];
  normalizeConditionValue: (
    value: FilterConditionValue,
  ) => FilterConditionValue | null;
};

/** Compatibility name for control components while consumers migrate. */
export type FilterDefinition<TItem = unknown> = CompiledProperty<TItem>;

export type CompiledPropertySchema<TItem> = {
  properties: readonly CompiledProperty<TItem>[];
  byKey: ReadonlyMap<string, CompiledProperty<TItem>>;
};

export type EvaluationEntry<TItem> = {
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

/** Compatibility name for existing grid/card presenters. */
export type FilterableItem<TItem> = EvaluationEntry<TItem>;

export type SearchWorkingSet<TItem> = {
  entries: readonly EvaluationEntry<TItem>[];
};

export type SearchResult<TItem> = {
  entries: readonly EvaluationEntry<TItem>[];
  matchCount: number;
};

/**
 * A complete, immutable engine run. Source is input-only; query is state-only;
 * runtime contains compiled/cached field metadata; working is plugin-owned;
 * result is assigned only by finalization.
 */
export type EngineContext<TItem> = {
  source: readonly TItem[];
  query: Readonly<SearchQuery>;
  runtime: CompiledPropertySchema<TItem>;
  working: SearchWorkingSet<TItem>;
  result?: SearchResult<TItem>;
};

export type SearchEnginePlugin<TItem> = {
  id: string;
  execute: (context: EngineContext<TItem>) => EngineContext<TItem>;
};
