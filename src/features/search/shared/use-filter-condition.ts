"use client";

import { useCallback } from "react";
import {
  FilterConditionValue,
  FilterDefinition,
  Operator,
} from "./filter-definition";
import { createFilterStore } from "./filter-store";
import { useFilterStore } from "../components/useFilterStore";

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
  // const condition = createFilterStore((state) =>
  //   state.conditions.find((current) => current.fieldKey === filter.key),
  // );
  // const upsertCondition = createFilterStore((state) => state.upsertCondition);
  // const removeCondition = createFilterStore((state) => state.removeCondition);
  const condition = useFilterStore((state) =>
    state.conditions.find((current) => current.fieldKey === filter.key),
  );
  const upsertCondition = useFilterStore((state) => state.upsertCondition);
  const removeCondition = useFilterStore((state) => state.removeCondition);

  // if (!condition?.operator) {
  //   console.warn(`====================Condition for field ${filter.key} is missing operator. This may indicate a misconfiguration in the filter store or an issue with the filter definition. Defaulting to the first operator in the filter definition.`
  //   );
  // }
  const operator: Operator = condition?.operator ?? filter.operators[0];
  // console.log(`====================Condition for field ${operator}`
  //   );
  //   console.log(filter.operators);

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
