import type {
  FilterCondition,
  FilterConditionValue,
  Operator,
} from "./filter-definition";

/** A declarative filter condition exposed as a selectable UI preset. */
export type FilterPresetConfig<TFilterKey extends string = string> = {
  label: string;
  filterKey: TFilterKey;
  conditionValue: FilterConditionValue;
  operator: Operator;
};

/** The controlled UI model consumed by a preset chip. */
export type FilterPreset = {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
};

function isSamePrimitiveValue(
  left: FilterConditionValue,
  right: FilterConditionValue,
): boolean {
  return left === right;
}

function isSameUnorderedArray(
  left: readonly unknown[],
  right: readonly unknown[],
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  const remaining = [...right];
  return left.every((value) => {
    const index = remaining.findIndex((candidate) => candidate === value);
    if (index === -1) {
      return false;
    }
    remaining.splice(index, 1);
    return true;
  });
}

/**
 * Compares stored filter values with preset values. Multi-select values are
 * compared as a set, while between ranges retain their lower/upper ordering.
 */
export function isSameFilterPresetValue(
  left: FilterConditionValue,
  right: FilterConditionValue,
  operator: Operator,
): boolean {
  if (!Array.isArray(left) || !Array.isArray(right)) {
    return isSamePrimitiveValue(left, right);
  }

  if (operator === "between") {
    return left.length === right.length && left.every((value, index) => value === right[index]);
  }

  return isSameUnorderedArray(left, right);
}

export function isFilterPresetSelected<TFilterKey extends string>(
  preset: FilterPresetConfig<TFilterKey>,
  conditions: readonly FilterCondition[],
): boolean {
  const condition = conditions.find(
    (current) => current.fieldKey === preset.filterKey,
  );

  return (
    condition?.operator === preset.operator &&
    isSameFilterPresetValue(
      condition.value,
      preset.conditionValue,
      preset.operator,
    )
  );
}

/** Returns null when toggling an active preset off, otherwise its condition. */
export function getFilterPresetNextCondition<TFilterKey extends string>(
  preset: FilterPresetConfig<TFilterKey>,
  conditions: readonly FilterCondition[],
): FilterCondition | null {
  if (isFilterPresetSelected(preset, conditions)) {
    return null;
  }

  return {
    id: preset.filterKey,
    fieldKey: preset.filterKey,
    operator: preset.operator,
    value: preset.conditionValue,
  };
}
