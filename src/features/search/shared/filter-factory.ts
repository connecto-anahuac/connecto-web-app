import {
  Editor,
  FilterDefinition,
  FilterPrimitive,
} from "./filter-definition";
import { FilterField, FilterFieldOption } from "./filter-field";
import { getOperatorsForValueType } from "./operator-policy";

/**
 * valueType + inputType から描画すべき editor（UIコンポーネント種別）を導出する。
 */
function deriveEditor<TItem>(field: FilterField<TItem>): Editor {
  if (field.inputType === "option") {
    // 複数選択（デフォルト）はチェックリスト、明示的に単一選択なら select。
    // return field.multiple === false ? "select" : "multiSelect";
    return "enum";
  }

  switch (field.valueType) {
    case "number":
      return "number";
    case "date":
      return "date";
    default:
      return "text";
  }
}

/**
 * dataset から distinct な値を集めて選択肢を導出する（dynamicOptions 用）。
 */
function deriveOptionsFromDataset<TItem>(
  field: FilterField<TItem>,
  dataset: readonly TItem[],
): FilterFieldOption[] {
  const seen = new Set<FilterPrimitive>();
  const options: FilterFieldOption[] = [];

  for (const item of dataset) {
    const raw = field.getValue(item);
    const values = Array.isArray(raw) ? raw : [raw];

    for (const value of values) {
      if (value === null || value === undefined) {
        continue;
      }
      if (seen.has(value)) {
        continue;
      }

      seen.add(value);
      options.push({ label: String(value), value });
    }
  }

  return options.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * 宣言的な FilterField から、実行に必要な情報を全て埋めた FilterDefinition を生成する。
 *
 * - operators: field.operators の上書きが無ければ valueType から自動導出
 * - editor: valueType + inputType から自動導出
 * - options: static（field.options）優先、無ければ dynamicOptions 時に dataset から導出
 */
export function buildFilterDefinition<TItem>(
  field: FilterField<TItem>,
  dataset?: readonly TItem[],
): FilterDefinition<TItem> {
  const operators = field.operators ?? getOperatorsForValueType(field.valueType);

  const base = {
    key: field.key,
    label: field.label,
    editor: deriveEditor(field),
    valueType: field.valueType,
    operators,
    getValue: field.getValue,
  } as const;

  if (field.inputType === "option") {
    const options =
      field.options ??
      (field.dynamicOptions && dataset
        ? deriveOptionsFromDataset(field, dataset)
        : []);

    return {
      ...base,
      inputType: "option",
      options,
    };
  }

  return {
    ...base,
    inputType: "free",
  };
}

/**
 * FilterField の配列から FilterDefinition の配列を生成する。
 */
export function buildFilterDefinitions<TItem>(
  fields: readonly FilterField<TItem>[],
  dataset?: readonly TItem[],
): FilterDefinition<TItem>[] {
  return fields.map((field) => buildFilterDefinition(field, dataset));
}
