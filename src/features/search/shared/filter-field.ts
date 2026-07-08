import {
  FilterPrimitive,
  Operator,
  ValueType,
} from "./filter-definition";

/**
 * option フィルターの選択肢。
 * select menuの選択アイテム
 */
export type FilterFieldOption<TValue extends FilterPrimitive = FilterPrimitive> = {
  label: string;
  value: TValue;
};

/**
 * フィールドの宣言（プレゼンテーション非依存 / シリアライズ可能）。
 *
 * ここでは「そのフィールドが何のデータ型か」だけを宣言する。
 * operator と editor（UIコンポーネント種別）は valueType から自動導出するため持たない。
 * icon などの表示情報は filter-metadata 側で field key に紐付けて管理する。
 */
// TItem ->実際の値
// TValue -> フィルターで扱う値の型
type BaseFilterField<TItem, TValue extends FilterPrimitive = FilterPrimitive> = {
  key: string;
  label: string;
  valueType: ValueType;
  getValue: (item: TItem) => TValue | TValue[] | null | undefined;
  /** valueType 由来のデフォルト operator を上書きしたい場合のみ指定 */
  operators?: Operator[];
};

/** 自由入力（text / number / date） */
export type FreeFilterField<
  TItem,
  TValue extends FilterPrimitive = FilterPrimitive,
> = BaseFilterField<TItem, TValue> & {
  inputType: "free";
};

/** 選択肢入力（select / multiSelect） */
export type OptionFilterField<
  TItem,
  TValue extends FilterPrimitive = FilterPrimitive,
> = BaseFilterField<TItem, TValue> & {
  inputType: "option";
  /** 確定している選択肢は static に持たせる */
  options?: FilterFieldOption<TValue>[];
  /** true の場合、選択肢を dataset から実行時に導出する（不確定な集合向け） */
  dynamicOptions?: boolean;
  /**
   * 複数選択を許可するか（チェックリスト UI / operator "in"）。
   * データ型（valueType）は単一値でも、フィルターとしては複数値を選べるため
   * ここで UI の選択多重度を制御する。デフォルトは複数選択（true）。
   */
  multiple?: boolean;
};

export type FilterField<
  TItem,
  TValue extends FilterPrimitive = FilterPrimitive,
> = FreeFilterField<TItem, TValue> | OptionFilterField<TItem, TValue>;

/**
 * 型付きの field を宣言するためのヘルパー。
 * 型推論を効かせつつ FilterField として扱えるようにする。
 */
export function defineFilterField<TItem, TValue extends FilterPrimitive = FilterPrimitive>(
  field: FilterField<TItem, TValue>,
): FilterField<TItem, TValue> {
  return field;
}
