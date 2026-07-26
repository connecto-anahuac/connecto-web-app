import { IconName } from "@/components/icon";
import { FilterPrimitive, Operator, ValueType } from "./filterDefinition";

/**
 * option フィルターの選択肢。
 * select menuの選択アイテム
 */
export type FilterFieldOption<
  TValue extends FilterPrimitive = FilterPrimitive,
> = {
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
type BaseFilterDefinitionConfig<
  TItem,
  TValue extends FilterPrimitive = FilterPrimitive,
> = {
  key: string;
  label: string;
  icon: IconName;
  valueType: ValueType;
  getValue: (item: TItem) => TValue | TValue[] | null | undefined;
  /** valueType 由来のデフォルト operator を上書きしたい場合のみ指定 */
  operators?: Operator[];
};

/** 自由入力（text / number / date） */
export type FreeFilterDefinitionConfig<
  TItem,
  TValue extends FilterPrimitive = FilterPrimitive,
> = BaseFilterDefinitionConfig<TItem, TValue> & {
  inputType: "free";
};

/** 選択肢入力（select / multiSelect） */
type StaticOptionFilterField<
  TItem,
  TValue extends FilterPrimitive = FilterPrimitive,
> = BaseFilterDefinitionConfig<TItem, TValue> & {
  /** 確定している選択肢は static に持たせる */
  options: FilterFieldOption<TValue>[];
  /** true の場合、選択肢を dataset から実行時に導出する（不確定な集合向け） */
  dynamicOptions?: never;
};

type DynamicOptionFilterField<
  TItem,
  TValue extends FilterPrimitive = FilterPrimitive,
> = BaseFilterDefinitionConfig<TItem, TValue> & {
  /** 確定している選択肢は static に持たせる */
  options?: never;
  /** true の場合、選択肢を dataset から実行時に導出する（不確定な集合向け） */
  dynamicOptions: boolean;
};

export type OptionFilterDefinitionConfig<
  TItem,
  TValue extends FilterPrimitive = FilterPrimitive,
> = BaseFilterDefinitionConfig<TItem, TValue> & {
  inputType: "option";
  /**
   * 複数選択を許可するか（チェックリスト UI / operator "in"）。
   * データ型（valueType）は単一値でも、フィルターとしては複数値を選べるため
   * ここで UI の選択多重度を制御する。デフォルトは複数選択（true）。
   */
  multiple?: boolean;
} & (
    | StaticOptionFilterField<TItem, TValue>
    | DynamicOptionFilterField<TItem, TValue>
  );

export type FilterDefinitionConfig<
  TItem,
  TValue extends FilterPrimitive = FilterPrimitive,
> = FreeFilterDefinitionConfig<TItem, TValue> | OptionFilterDefinitionConfig<TItem, TValue>;

/**
 * 型付きの field を宣言するためのヘルパー。
 * 型推論を効かせつつ FilterField として扱えるようにする。
 */
export function defineFilterField<
  TItem,
  TValue extends FilterPrimitive = FilterPrimitive,
>(field: FilterDefinitionConfig<TItem, TValue>): FilterDefinitionConfig<TItem, TValue> {
  return field;
}
