import type { DataFieldValueType } from "@/shared/component/composite/table/dataView.types";

export const operators = [
  "eq",
  "contains",
  "gt",
  "gte",
  "lt",
  "lte",
  "between",
  "in",
] as const;
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
};
export const operatorNumberLabels: Record<Operator, string> = {
  eq: "=",
  contains: "Contiene",
  gt: ">",
  gte: "≧",
  lt: "<",
  lte: "≦",
  between: "Entre",
  in: "=",
};
export const operatorTextButtonLabels: Record<Operator, string> = {
  eq: ":",
  contains: ":",
  gt: "Mayor que",
  gte: "Mayor o igual que",
  lt: "Menor que",
  lte: "Menor o igual que",
  between: "Entre",
  in: "Es",
};
export const operatorNumberButtonLabels: Record<Operator, string> = {
  eq: "=",
  contains: "=",
  gt: ">",
  gte: "≧",
  lt: "<",
  lte: "≦",
  between: "<>",
  in: "=",
};

/**
 * データ型（valueType）ごとに使用可能な operator を制限する唯一の定義。
 * ここが「データ型から自動で operator を絞る」ルールの単一の情報源。
 *
 * 例: text は大小比較しない（gt/lt を持たない）。
 */
// export const OPERATORS_BY_VALUE_TYPE: Record<ValueType, Operator[]> = {
//   text: ["contains", "eq", "in"],
//   number: ["eq", "gt", "gte", "lt", "lte", "between", "in"],
//   date: ["eq", "gt", "gte", "lt", "lte", "between"],
//   singleSelect: ["eq", "in"], //TODO remove??
//   multiSelect: ["in"], //TODO remove??
//   boolean: ["eq"],
// };
export const OPERATORS_BY_VALUE_TYPE: Record<DataFieldValueType, Operator[]> = {
  text: ["contains", "eq"],
  number: ["eq", "gt", "gte", "lt", "lte", "between"],
  date: ["eq", "gt", "gte", "lt", "lte", "between"],
  enum: ["in"],
  boolean: ["eq"],
};

export function getOperatorsForValueType(valueType: DataFieldValueType): Operator[] {
  return OPERATORS_BY_VALUE_TYPE[valueType];
}

const NUMERIC_LABEL_VALUE_TYPES: ReadonlySet<DataFieldValueType> = new Set<DataFieldValueType>([
  "number",
  "date",
]);

/**
 * operator の表示ラベルを valueType に応じて選ぶ。
 * number / date は記号ラベル（>, ≧ など）、それ以外はテキストラベル（Es, Contiene など）。
 */
export function getOperatorLabel(
  valueType: DataFieldValueType,
  operator: Operator,
): string {
  const labels = NUMERIC_LABEL_VALUE_TYPES.has(valueType)
    ? operatorNumberLabels
    : operatorTextLabels;

  return labels[operator] ?? operator;
}
