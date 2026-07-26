import { IconName } from "@/components/icon";
import { Operator } from "./operatorPolicy";



// UIの入力法式 //TODO select -> singleSelect
export const editor = ["text", "number", "select", "multiSelect","enum", "date"] as const;
export type Editor = (typeof editor)[number];

//valueの型
export const valueTypes = ["text", "number", "date",  "enum", "boolean"] as const;
export type ValueType = (typeof valueTypes)[number];

// filterで使える最小単位
export type FilterPrimitive = string | number | boolean;
// 範囲検索用のfilterの型
export type FilterRangeValue = [FilterPrimitive, FilterPrimitive];
//filterで使えるすべての型
export type FilterConditionValue = FilterPrimitive | FilterPrimitive[] | FilterRangeValue | null;

type BaseFilterDefinition<TItem, TValue extends FilterPrimitive = FilterPrimitive> = {
  key: string;
  label: string;
  icon: IconName;
  editor: Editor;
  valueType: ValueType;
  operators: Operator[];
  getValue: (item: TItem) => TValue | TValue[] | null | undefined; //student[definition.key]の回避
  normalize?: (value: unknown) => TValue | TValue[] | null;
};

// =============================

//自由入力
type FreeFilterDefinition<TItem, TValue extends FilterPrimitive = FilterPrimitive> = BaseFilterDefinition<TItem, TValue> & {
  inputType: "free";
  options?: never;
};

// 選択肢入力
type OptionFilterDefinition<TItem, TValue extends FilterPrimitive = FilterPrimitive> = BaseFilterDefinition<TItem, TValue> & {
  inputType: "option";

  options: {
    label: string;
    value: TValue;
  }[];
};

//filterの型
export type FilterDefinition<TItem = unknown, TValue extends FilterPrimitive = FilterPrimitive> =
  | FreeFilterDefinition<TItem, TValue>
  | OptionFilterDefinition<TItem, TValue>;


  // 実際のfilterの値
export type FilterCondition = {
  id: string;
  fieldKey: string;
  operator: Operator;
  value: FilterConditionValue;
};

export type FilterDefinitionMap<TItem> = Record<string, FilterDefinition<TItem>>;

// filter適用後のリスト表示用アイテム（list/card 表示共通）
export type FilterableItem<TItem> = {
  listId: string;
  filteringScore: number;
  isMatch: boolean;
  item: TItem;
};
