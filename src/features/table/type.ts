import { FilterConditionValue } from "../search/shared/filterDefinition";
import { Operator } from "../search/shared/operatorPolicy";
// import type { Operator } from "./operatorPolicy";

// export type FilterPrimitive = string | number | boolean;
// export type FilterRangeValue = [FilterPrimitive, FilterPrimitive];
// export type FilterConditionValue =
//   | FilterPrimitive
//   | FilterPrimitive[]
//   | FilterRangeValue
//   | null;

//TODO deprecated? custom engine Value 
export type FilterCondition = {
  columnId: string;
  operator: Operator;
  value: FilterConditionValue;
};

export function defineFilterValue(value: unknown): value is FilterCondition {
  return (
    typeof value === "object" &&
    value !== null &&
    "columnId" in value &&
    "operator" in value &&
    "value" in value
  );
}