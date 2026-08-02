"use client";

import { useCallback, type ComponentPropsWithRef } from "react";
import type {
  DataFieldConfig,
  DataFieldOption,
} from "@/shared/types/dataView.types";
import {
  useDataSearchActions,
  useDataSearchQuery,
} from "../../../store/filter/useFilterStore";
import type { FilterConditionValue } from "../../../service/dataPipeline/filterDefinition";
import {
  getOperatorsForValueType,
  type Operator,
} from "../../../service/dataPipeline/operatorPolicy";
import { MultiSelectFilter } from "./multiselector/MultiselectFilter";
import { NumberFilter } from "./filterTypeContent/NumberFilter";
import { TextFilter } from "./filterTypeContent/TextFilter";

type Props<TItem> = ComponentPropsWithRef<"section"> & {
  column: DataFieldConfig<TItem>;
  options: readonly DataFieldOption[];
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
    (current) => current.fieldId === column.fieldId,
  );
  const operators = getOperatorsForValueType(column.valueType);
  const operator = condition?.operator ?? operators[0];

  const clear = useCallback(() => {
    removeCondition(column.fieldId);
  }, [column.fieldId, removeCondition]);

  const setValue = useCallback(
    (value: FilterConditionValue, nextOperator?: Operator) => {
      if (isEmptyValue(value)) {
        removeCondition(column.fieldId);
        return;
      }

      upsertCondition({
        fieldId: column.fieldId,
        operator: nextOperator ?? condition?.operator ?? operators[0],
        value,
      });
    },
    [column.fieldId, condition?.operator, operators, removeCondition, upsertCondition],
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
      values={Array.isArray(condition?.value) ? condition.value.map(String) : []}
      {...props}
    />
  );
}
