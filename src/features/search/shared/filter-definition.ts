import { IconName } from "@/components/icon";

export const operators = ["eq", "contains", "gt", "gte", "lt", "lte",  "between","in"] as const;
export type Operator = (typeof operators)[number];
export const operatorTextLabels: Record<Operator, string> = {
  eq: "Es", //ToDo eq ->in 統合？？？
  contains: "Contiene",
  gt: "Mayor que",
  gte: "Mayor o igual que",
  lt: "Menor que",
  lte: "Menor o igual que",
  between: "Entre",
  in: "Es",
}
export const operatorNumberLabels: Record<Operator, string> = {
  eq: "=",
  contains: "Contiene",
  gt: ">",
  gte: "≧",
  lt: "<",
  lte: "≦",
  between: "Entre",
  in: "Es",
}

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
