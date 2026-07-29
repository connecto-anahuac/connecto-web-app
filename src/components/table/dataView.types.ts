import type { IconName } from "@/components/icon";

export type DataViewValueType = "text" | "number" | "enum";

/**
 * One declarative description shared by tabular and card/grid consumers.
 * `accessor` stays data-oriented; view-specific components decide their layout.
 */
export type DataViewColumn<TItem> = {
  id: string;
  label: string;
  icon: IconName;
  valueType: DataViewValueType;
  accessor: (item: TItem) => string | number | null;//colIdから返す値。filter,sortに使う
  format: (item: TItem) => string;//Cellに渡す値
  searchTexts?:(item: TItem) => string[];//テキスト検索時の文字列
  minWidth?: number;
  maxWidth?: number;
  filterable?: boolean;
  options?: readonly { label: string; value: string }[];
};

export type DataViewConfig<TItem> = {
  columns: readonly DataViewColumn<TItem>[];
};
