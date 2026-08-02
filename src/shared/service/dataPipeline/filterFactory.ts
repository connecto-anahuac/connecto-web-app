import {
  buildDataViewMetadata,
  getDataViewColumnSearchTexts,
} from "@/shared/component/composite/table/buildDataViewMetadata";
import type {
  DataViewConfig,
  DataViewMetadata,
  DataFieldValueType,
} from "@/shared/component/composite/table/dataView.types";
import type {
  CanonicalValue,
  CompiledSearchField,
  CompiledSearchSchema,
  FilterConditionValue,
} from "./filterDefinition";
import { getOperatorsForValueType } from "./operatorPolicy";

function normalizeValue(
  valueType: DataFieldValueType,
  value: unknown,
): CanonicalValue | null {
  if (value === null || value === undefined) return null;

  switch (valueType) {
    case "number": {
      const numberValue = typeof value === "number" ? value : Number(value);
      return Number.isFinite(numberValue) ? numberValue : null;
    }
    case "boolean":
      return typeof value === "boolean" ? value : String(value) === "true";
    case "date": {
      const timestamp =
        value instanceof Date ? value.getTime() : Date.parse(String(value));
      return Number.isNaN(timestamp) ? null : timestamp;
    }
    case "text":
    case "enum":
      return String(value);
  }
}

function normalizeConditionValue(
  valueType: DataFieldValueType,
  value: FilterConditionValue,
): FilterConditionValue | null {
  if (value === null) return null;
  if (Array.isArray(value)) {
    const normalized = value
      .map((entry) => normalizeValue(valueType, entry))
      .filter((entry): entry is CanonicalValue => entry !== null);
    return normalized.length ? normalized : null;
  }
  return normalizeValue(valueType, value);
}

/** column.id - property のmap */  
export function compileDataViewSchema<TItem>(
  config: DataViewConfig<TItem>,
  dataset: readonly TItem[],
  metadata: DataViewMetadata = buildDataViewMetadata(config, dataset),
): CompiledSearchSchema<TItem> {
  const properties = config.fields
    .filter((column) => column.filterable !== false)
    .map(
      (column): CompiledSearchField<TItem> => ({
        fieldId: column.fieldId,
        operators: getOperatorsForValueType(column.valueType),
        readCanonicalValue: (item) =>
          normalizeValue(column.valueType, column.accessor(item)),
        getSearchText: (item) => [
          ...getDataViewColumnSearchTexts(column, metadata, item),
        ],
        normalizeConditionValue: (value) =>
          normalizeConditionValue(column.valueType, value),
      }),
    );

  return {
    fields: properties,
    byKey: new Map(properties.map((property) => [property.fieldId, property])),
  };
}
