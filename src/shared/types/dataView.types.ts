import type { IconName } from "@/shared/component/primitive/icon";

export const dataFieldValueTypes = ["text", "number", "date", "enum", "boolean"] as const;
export type DataFieldValueType = (typeof dataFieldValueTypes)[number];

export type DataFieldOption = {
  label: string;
  value: string;
  searchTexts: readonly string[];
};

export type DataViewMetadata = {
  /** Runtime options grouped by `DataViewColumn.id`. */
  optionsByFieldId: Readonly<Record<string, readonly DataFieldOption[]>>;
};

/**
 * One declarative description shared by tabular and card/grid consumers.
 * `accessor` stays data-oriented; view-specific components decide their layout.
 */
export type DataFieldConfig<TItem, TFieldId extends string = string> = {
  fieldId: TFieldId; //
  label: string;
  icon: IconName;
  valueType: DataFieldValueType;
  accessor: (item: TItem) => string | number | null; //colIdから返す値。filter,sortに使う
  format: (item: TItem) => string; //Cellに渡す値
  searchTexts?: (item: TItem) => string[]; //テキスト検索時の文字列
  minWidth?: number;
  maxWidth?: number;
  filterable?: boolean;
  /** Generate unique filter options from the table data at runtime. */
  dynamicOption?: boolean;
  options?: readonly Pick<DataFieldOption, "label" | "value">[];
};

export type DefaultConfig = {
  viewMode: "table" | "diagram";
}
export type DataViewConfig<TItem, TFieldId extends string = string> = {
  fields: readonly DataFieldConfig<TItem, TFieldId>[];
  default?: DefaultConfig;
};
