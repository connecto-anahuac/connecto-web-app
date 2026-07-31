import type { IconName } from "@/components/icon";
import { ValueType } from "@/features/search/shared/filterDefinition";

// export type DataViewValueType = "text" | "number" | "enum"| "date"  | "boolean";

export type Option = {
  label: string;
  value: string;
  searchTexts: readonly string[];
};

/**
 * One declarative description shared by tabular and card/grid consumers.
 * `accessor` stays data-oriented; view-specific components decide their layout.
 */
export type DataViewColumn<TItem> = {
  id: string;
  label: string;
  icon: IconName;
  valueType: ValueType;
  accessor: (item: TItem) => string | number | null;//colIdから返す値。filter,sortに使う
  format: (item: TItem) => string;//Cellに渡す値
  searchTexts?:(item: TItem) => string[];//テキスト検索時の文字列
  minWidth?: number;
  maxWidth?: number;
  filterable?: boolean;
  /** Generate unique filter options from the table data at runtime. */
  dynamicOption?: boolean;
  options?: readonly Pick<Option, "label" | "value">[];
};

export type DataViewConfig<TItem> = {
  columns: readonly DataViewColumn<TItem>[];
};
