import {
  Operator,
  ValueType,
  operatorNumberLabels,
  operatorTextLabels,
} from "./filter-definition";

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
export const OPERATORS_BY_VALUE_TYPE: Record<ValueType, Operator[]> = {
  text: ["contains", "eq"],
  number: ["eq", "gt", "gte", "lt", "lte", "between"],
  date: ["eq", "gt", "gte", "lt", "lte", "between"],
  enum: ["in"],
  boolean: ["eq"],
};

export function getOperatorsForValueType(valueType: ValueType): Operator[] {
  return OPERATORS_BY_VALUE_TYPE[valueType];
}

const NUMERIC_LABEL_VALUE_TYPES: ReadonlySet<ValueType> = new Set<ValueType>([
  "number",
  "date",
]);

/**
 * operator の表示ラベルを valueType に応じて選ぶ。
 * number / date は記号ラベル（>, ≧ など）、それ以外はテキストラベル（Es, Contiene など）。
 */
export function getOperatorLabel(
  valueType: ValueType,
  operator: Operator,
): string {
  const labels = NUMERIC_LABEL_VALUE_TYPES.has(valueType)
    ? operatorNumberLabels
    : operatorTextLabels;

  return labels[operator] ?? operator;
}
