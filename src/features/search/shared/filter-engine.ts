import {
  FilterableItem,
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

function matchesAllConditions<TItem>(
  item: TItem,
  conditions: FilterCondition[],
  definitionMap: Map<string, FilterDefinition<TItem>>,
): boolean {
  // AND 検索
  return conditions.every((condition) => {
    const definition = definitionMap.get(condition.fieldKey);
    if (!definition) {
      return false;
    }

    return matchesCondition(item, condition, definition);
  });
}

export function applyFilters<TItem>(
  items: TItem[],
  definitions: FilterDefinition<TItem>[],
  conditions: FilterCondition[],
): TItem[] {
  if (conditions.length === 0) {
    return items;
  }

  const definitionMap = new Map(
    definitions.map((definition) => [definition.key, definition]),
  );

  return items.filter((item) => matchesAllConditions(item, conditions, definitionMap));
}




/**
 * items を FilterableItem に変換する。
 * list/card どちらの表示にも共通で使える形。
 * - isMatch: 条件が無ければ常に true、あれば AND 検索で判定
 * - filteringScore: 現状は未実装（sort 未対応）のため常に 0
 */
function resolveListId<TItem>(item: TItem, index: number): string {
  if (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    typeof (item as { id?: unknown }).id === "string"
  ) {
    return (item as { id: string }).id;
  }

  return `filterable-item-${index}`;
}

export function toFilterableItems<TItem>(items: TItem[]): FilterableItem<TItem>[] {
  return items.map((item, index) => ({
    listId: resolveListId(item, index),
    filteringScore: 0,
    isMatch: true,
    item,
  }));
}


/**
 * 既存の FilterableItem[] に対して condition を評価し、isMatch を更新する。
 * condition が変化した時にこれを呼び出して filterableItems を更新する想定。
 * listId / filteringScore / item はそのまま引き継ぐ。
 */
export function applyFilterMatches<TItem>(
  filterableItems: FilterableItem<TItem>[],
  definitions: FilterDefinition<TItem>[],
  conditions: FilterCondition[],
): FilterableItem<TItem>[] {
  const definitionMap = new Map(
    definitions.map((definition) => [definition.key, definition]),
  );

  return filterableItems.map((filterableItem) => ({
    ...filterableItem,
    isMatch:
      conditions.length === 0 ||
      matchesAllConditions(filterableItem.item, conditions, definitionMap),
  }));
}