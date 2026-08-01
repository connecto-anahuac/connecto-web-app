"use client";

import { useCallback, type ComponentPropsWithRef } from "react";
import type {
  DataViewColumn,
  Option,
} from "@/components/table/dataView.types";
import {
  useDataSearchActions,
  useDataSearchQuery,
} from "../Provider/useFilterStore";
import type { FilterConditionValue } from "../../shared/filterDefinition";
import {
  getOperatorsForValueType,
  type Operator,
} from "../../shared/operatorPolicy";
import { MultiSelectFilter } from "./multiselector/MultiselectFilter";
import { NumberFilter } from "./NumberFilter";
import { TextFilter } from "./TextFilter";

type Props<TItem> = ComponentPropsWithRef<"section"> & {
  column: DataViewColumn<TItem>;
  options: readonly Option[];
};

function isEmptyValue(value: FilterConditionValue): boolean {
  return (
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

export function FilterRenderer<TItem>({
  column,
  options,
  ...props
}: Props<TItem>) {
  const query = useDataSearchQuery();
  const { removeCondition, upsertCondition } = useDataSearchActions();
  const condition = query.conditions.find(
    (current) => current.columnId === column.id,
  );
  const operators = getOperatorsForValueType(column.valueType);
  const operator = condition?.operator ?? operators[0];

  const clear = useCallback(() => {
    removeCondition(column.id);
  }, [column.id, removeCondition]);

  const setValue = useCallback(
    (value: FilterConditionValue, nextOperator?: Operator) => {
      if (isEmptyValue(value)) {
        removeCondition(column.id);
        return;
      }

      upsertCondition({
        columnId: column.id,
        operator: nextOperator ?? condition?.operator ?? operators[0],
        value,
      });
    },
    [column.id, condition?.operator, operators, removeCondition, upsertCondition],
  );

  const setOperator = useCallback(
    (nextOperator: Operator) => {
      if (!condition) return;
      upsertCondition({ ...condition, operator: nextOperator });
    },
    [condition, upsertCondition],
  );

  if (column.valueType === "text") {
    return (
      <TextFilter
        column={column}
        operator={operator}
        onClear={clear}
        onOperatorChange={setOperator}
        onValueChange={(value) => setValue(value)}
        value={typeof condition?.value === "string" ? condition.value : ""}
        {...props}
      />
    );
  }

  if (column.valueType === "number") {
    return (
      <NumberFilter
        column={column}
        operator={operator}
        onClear={clear}
        onOperatorChange={setOperator}
        onValueChange={(value) => setValue(value)}
        value={typeof condition?.value === "number" ? condition.value : null}
        {...props}
      />
    );
  }

  return (
    <MultiSelectFilter
      column={column}
      operator={operator}
      options={options}
      onClear={clear}
      onOperatorChange={setOperator}
      onValueChange={(value) => setValue(value, "in")}
      value={Array.isArray(condition?.value) ? condition.value.map(String) : []}
      {...props}
    />
  );
}
