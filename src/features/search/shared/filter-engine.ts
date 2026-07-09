import {
  FilterCondition,
  FilterDefinition,
  FilterPrimitive,
  FilterRangeValue,
  Operator,
  ValueType,
} from "./filter-definition";

function isRangeValue(
  value: FilterCondition["value"],
): value is FilterRangeValue {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((entry) => typeof entry !== "object")
  );
}

function normalizeComparableValue(
  valueType: ValueType,
  value: unknown,
): FilterPrimitive | null {
  if (value === null || value === undefined) {
    return null;
  }

  switch (valueType) {
    case "number":
      return typeof value === "number" ? value : Number(value);

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

function compareScalar(
  left: FilterPrimitive | null,
  right: FilterPrimitive | null,
): number | null {
  if (left === null || right === null) {
    return null;
  }

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  if (typeof left === "boolean" && typeof right === "boolean") {
    return Number(left) - Number(right);
  }

  return String(left).localeCompare(String(right));
}

// contains
function includesText(
  actual: unknown,
  expected: FilterPrimitive | null,
): boolean {
  if (actual === null || actual === undefined || expected === null) {
    return false;
  }

  return String(actual)
    .toLocaleLowerCase()
    .includes(String(expected).toLocaleLowerCase());
}

export function isOperatorAllowed<TItem>(
  definition: FilterDefinition<TItem>,
  operator: Operator,
): boolean {
  return definition.operators.includes(operator);
}

export function normalizeCondition<TItem>(
  condition: FilterCondition,
  definition: FilterDefinition<TItem>,
): FilterCondition | null {
  if (!isOperatorAllowed(definition, condition.operator)) {
    return null;
  }

  return condition;
}

export function matchesCondition<TItem>(
  item: TItem,
  condition: FilterCondition,
  definition: FilterDefinition<TItem>,
): boolean {
  const normalizedCondition = normalizeCondition(condition, definition);
  if (!normalizedCondition) {
    return false;
  }

  const actualValue = definition.getValue(item);
  const expectedValue = normalizedCondition.value;

  switch (normalizedCondition.operator) {
    case "eq": {
      if (Array.isArray(actualValue)) {
        // OR 検索
        return actualValue.some((entry) => entry === expectedValue);
      }

      return actualValue === expectedValue;
    }
    case "in": {
      if (!Array.isArray(expectedValue)) {
        return false;
      }

      if (Array.isArray(actualValue)) {
        return actualValue.some((entry) => expectedValue.includes(entry));
      }
      if (actualValue === null || actualValue === undefined) {
        return false;
      }
      return expectedValue.includes(actualValue);
    }

    case "contains":
      return includesText(
        actualValue,
        Array.isArray(expectedValue) ? null : expectedValue,
      );

    case "between": {
      if (!isRangeValue(expectedValue) || Array.isArray(actualValue)) {
        return false;
      }

      const actualComparable = normalizeComparableValue(
        definition.valueType,
        actualValue,
      );
      const minComparable = normalizeComparableValue(
        definition.valueType,
        expectedValue[0],
      );
      const maxComparable = normalizeComparableValue(
        definition.valueType,
        expectedValue[1],
      );

      const minResult = compareScalar(actualComparable, minComparable);
      const maxResult = compareScalar(actualComparable, maxComparable);

      return (
        minResult !== null &&
        maxResult !== null &&
        minResult >= 0 &&
        maxResult <= 0
      );
    }

    case "gt":
    case "gte":
    case "lt":
    case "lte": {
      if (Array.isArray(actualValue) || Array.isArray(expectedValue)) {
        return false;
      }

      const actualComparable = normalizeComparableValue(
        definition.valueType,
        actualValue,
      );
      const expectedComparable = normalizeComparableValue(
        definition.valueType,
        expectedValue,
      );
      const result = compareScalar(actualComparable, expectedComparable);

      if (result === null) {
        return false;
      }

      switch (normalizedCondition.operator) {
        case "gt":
          return result > 0;
        case "gte":
          return result >= 0;
        case "lt":
          return result < 0;
        case "lte":
          return result <= 0;
        default:
          return false;
      }
    }
  }
}

export function applyFilters<TItem>(
  items: TItem[],
  definitions: FilterDefinition<TItem>[],
  conditions: FilterCondition[],
): TItem[] {
  const definitionMap = new Map(
    definitions.map((definition) => [definition.key, definition]),
  );

  if (conditions.length === 0) {
    return items;
  }

  return items.filter((item) =>
    // AND 検索
    conditions.every((condition) => {
      const definition = definitionMap.get(condition.fieldKey);
      if (!definition) {
        return false;
      }

      return matchesCondition(item, condition, definition);
    }),
  );
}
