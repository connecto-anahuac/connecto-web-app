import type { IconName } from "@/components/icon";
import type {
  CanonicalValue,
  FilterConditionValue,
  FilterOption,
  ValueType,
} from "./filterDefinition";
import type { Operator } from "./operatorPolicy";

export type DataPropertyOption = FilterOption;

export type PropertySearchConfig<TItem> =
  | boolean
  | {
      getText?: (context: {
        item: TItem;
        sourceValue: unknown;
        canonicalValues: readonly CanonicalValue[];
        displayValues: readonly string[];
      }) => readonly string[];
    };

type BaseDataPropertyConfig<TItem> = {
  key: string;
  label: string;
  icon: IconName;
  valueType: ValueType;
  /** Reads the source value from the view model. */
  getValue: (item: TItem) => unknown;
  /** Converts source and filter-input values into comparison values. */
  normalize?: (value: unknown) => CanonicalValue | CanonicalValue[] | null;
  /** Converts a value into a visible string when it has no option label. */
  formatDisplay?: (context: {
    item: TItem;
    sourceValue: unknown;
    canonicalValue: CanonicalValue;
  }) => string;
  /** Explicitly controls global-text-search participation. */
  search?: PropertySearchConfig<TItem>;
  operators?: readonly Operator[];
};

export type FreeDataPropertyConfig<TItem> = BaseDataPropertyConfig<TItem> & {
  inputType: "free";
};

export type OptionDataPropertyConfig<TItem> = BaseDataPropertyConfig<TItem> & {
  inputType: "option";
  multiple?: boolean;
  options?: readonly DataPropertyOption[];
  dynamicOptions?: boolean;
};

/** The sole declaration for a data property and its search/filter metadata. */
export type DataPropertyConfig<TItem> =
  | FreeDataPropertyConfig<TItem>
  | OptionDataPropertyConfig<TItem>;

/** Compatibility alias retained only while all current consumers are migrated. */
export type FilterDefinitionConfig<TItem> = DataPropertyConfig<TItem>;

export function defineDataProperty<TItem>(
  property: DataPropertyConfig<TItem>,
): DataPropertyConfig<TItem> {
  return property;
}

export const defineFilterField = defineDataProperty;

export function isFilterConditionValue(
  value: unknown,
): value is FilterConditionValue {
  return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || Array.isArray(value);
}
