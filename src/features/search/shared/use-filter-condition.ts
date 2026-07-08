"use client";

import { useCallback } from "react";
import {
  FilterConditionValue,
  FilterDefinition,
  Operator,
} from "./filter-definition";
import { useFilterStore } from "./filter-store";

function isEmptyValue(value: FilterConditionValue): boolean {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  return Array.isArray(value) && value.length === 0;
}

/**
 * 1 フィールド分の FilterCondition を store と接続するフック。
 *
 * - condition の id / fieldKey は field key に一致（1 フィールド 1 condition）
 * - 値が空になったら condition を削除する
 */
export function useFilterCondition<TItem>(filter: FilterDefinition<TItem>) {
  const condition = useFilterStore((state) =>
    state.conditions.find((current) => current.fieldKey === filter.key),
  );
  const upsertCondition = useFilterStore((state) => state.upsertCondition);
  const removeCondition = useFilterStore((state) => state.removeCondition);

  const operator: Operator = condition?.operator ?? filter.operators[0];

  const clear = useCallback(() => {
    removeCondition(filter.key);
  }, [filter.key, removeCondition]);

  const setValue = useCallback(
    (value: FilterConditionValue, nextOperator?: Operator) => {
      if (isEmptyValue(value)) {
        removeCondition(filter.key);
        return;
      }

      upsertCondition({
        id: filter.key,
        fieldKey: filter.key,
        operator: nextOperator ?? condition?.operator ?? filter.operators[0],
        value,
      });
    },
    [filter.key, filter.operators, condition?.operator, upsertCondition, removeCondition],
  );

  const setOperator = useCallback(
    (nextOperator: Operator) => {
      if (!condition) {
        return;
      }
      upsertCondition({ ...condition, operator: nextOperator });
    },
    [condition, upsertCondition],
  );

  return { condition, operator, setValue, setOperator, clear };
}
