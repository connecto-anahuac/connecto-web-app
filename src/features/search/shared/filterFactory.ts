import type {
  CanonicalValue,
  CompiledProperty,
  CompiledPropertySchema,
  Editor,
  FilterConditionValue,
  FilterOption,
  ValueType,
} from "./filterDefinition";
import type { DataPropertyConfig } from "./filterField";
import { getOperatorsForValueType } from "./operatorPolicy";

function normalizeDefault(valueType: ValueType, value: unknown): CanonicalValue | CanonicalValue[] | null {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) {
    const values = value
      .map((entry) => normalizeDefault(valueType, entry))
      .filter((entry): entry is CanonicalValue => !Array.isArray(entry) && entry !== null);
    return values;
  }

  switch (valueType) {
    case "number": {
      const numberValue = typeof value === "number" ? value : Number(value);
      return Number.isFinite(numberValue) ? numberValue : null;
    }
    case "boolean":
      return typeof value === "boolean" ? value : String(value) === "true";
    case "date": {
      const timestamp = value instanceof Date ? value.getTime() : Date.parse(String(value));
      return Number.isNaN(timestamp) ? null : timestamp;
    }
    case "text":
    case "enum":
      return String(value);
  }
}

function toValues(value: CanonicalValue | CanonicalValue[] | null): CanonicalValue[] {
  return value === null ? [] : Array.isArray(value) ? value : [value];
}

function deriveEditor<TItem>(property: DataPropertyConfig<TItem>): Editor {
  if (property.inputType === "option") return property.multiple === false ? "select" : "multiSelect";
  if (property.valueType === "number") return "number";
  if (property.valueType === "date") return "date";
  return "text";
}

function normalizeConditionValue<TItem>(
  property: DataPropertyConfig<TItem>,
  normalize: (value: unknown) => CanonicalValue | CanonicalValue[] | null,
  value: FilterConditionValue,
): FilterConditionValue | null {
  if (value === null) return null;
  if (Array.isArray(value)) {
    const normalized = value.flatMap((entry) => toValues(normalize(entry)));
    return normalized.length === 0 ? null : normalized;
  }
  const normalized = normalize(value);
  if (normalized === null || Array.isArray(normalized)) return null;
  return normalized;
}

function deriveOptions<TItem>(
  property: DataPropertyConfig<TItem>,
  dataset: readonly TItem[],
  readCanonicalValue: (item: TItem) => CanonicalValue | CanonicalValue[] | null,
): readonly FilterOption[] {
  if (property.inputType !== "option") return [];
  if (property.options) return property.options;
  if (!property.dynamicOptions) return [];

  const seen = new Set<CanonicalValue>();
  const options: FilterOption[] = [];
  for (const item of dataset) {
    const sourceValue = property.getValue(item);
    for (const canonicalValue of toValues(readCanonicalValue(item))) {
      if (seen.has(canonicalValue)) continue;
      seen.add(canonicalValue);
      options.push({
        value: canonicalValue,
        label: property.formatDisplay?.({ item, sourceValue, canonicalValue }) ?? String(canonicalValue),
      });
    }
  }
  return options.sort((left, right) => left.label.localeCompare(right.label));
}

export function compilePropertySchema<TItem>(
  properties: readonly DataPropertyConfig<TItem>[],
  dataset: readonly TItem[],
): CompiledPropertySchema<TItem> {
  const compiledProperties = properties.map((property): CompiledProperty<TItem> => {
    const normalize = property.normalize ?? ((value: unknown) => normalizeDefault(property.valueType, value));
    const readCanonicalValue = (item: TItem) => normalize(property.getValue(item));
    const options = deriveOptions(property, dataset, readCanonicalValue);
    const optionLabels = new Map(options.map((option) => [option.value, option.label]));

    const formatDisplayValue = (item: TItem) => {
      const sourceValue = property.getValue(item);
      return toValues(readCanonicalValue(item)).map(
        (canonicalValue) =>
          optionLabels.get(canonicalValue) ??
          property.formatDisplay?.({ item, sourceValue, canonicalValue }) ??
          String(canonicalValue),
      );
    };

    const getSearchText = (item: TItem) => {
      if (!property.search) return [];
      const sourceValue = property.getValue(item);
      const canonicalValues = toValues(readCanonicalValue(item));
      const displayValues = formatDisplayValue(item);
      return typeof property.search === "object" && property.search.getText
        ? [...property.search.getText({ item, sourceValue, canonicalValues, displayValues })]
        : displayValues;
    };

    return {
      key: property.key,
      label: property.label,
      icon: property.icon,
      editor: deriveEditor(property),
      valueType: property.valueType,
      inputType: property.inputType,
      options,
      operators: property.operators ?? getOperatorsForValueType(property.valueType),
      isSearchable: Boolean(property.search),
      readCanonicalValue,
      formatDisplayValue,
      getSearchText,
      normalizeConditionValue: (value) => normalizeConditionValue(property, normalize, value),
    };
  });

  return { properties: compiledProperties, byKey: new Map(compiledProperties.map((property) => [property.key, property])) };
}

/** Compatibility helpers for existing presenters and filter controls. */
export function buildFilterDefinitions<TItem>(
  properties: readonly DataPropertyConfig<TItem>[],
  dataset: readonly TItem[] = [],
) {
  return compilePropertySchema(properties, dataset).properties;
}

export function buildFilterDefinition<TItem>(
  property: DataPropertyConfig<TItem>,
  dataset: readonly TItem[] = [],
) {
  return compilePropertySchema([property], dataset).properties[0]!;
}
