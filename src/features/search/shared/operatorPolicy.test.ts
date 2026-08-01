import { describe, expect, it } from "vitest";
import {
  getOperatorLabel,
  getOperatorsForValueType,
  OPERATORS_BY_VALUE_TYPE,
} from "./operatorPolicy";
import { dataFieldValueTypes } from "@/components/table/dataView.types";

describe("operator-policy", () => {
  it("covers every valueType", () => {
    for (const valueType of dataFieldValueTypes) {
      expect(OPERATORS_BY_VALUE_TYPE[valueType]).toBeDefined();
      expect(OPERATORS_BY_VALUE_TYPE[valueType].length).toBeGreaterThan(0);
    }
  });

  it("does not allow magnitude comparison operators for text", () => {
    const textOperators = getOperatorsForValueType("text");

    expect(textOperators).toContain("eq");
    expect(textOperators).toContain("contains");
    expect(textOperators).not.toContain("gt");
    expect(textOperators).not.toContain("lt");
    expect(textOperators).not.toContain("between");
  });

  it("allows range operators for number", () => {
    const numberOperators = getOperatorsForValueType("number");

    expect(numberOperators).toContain("gt");
    expect(numberOperators).toContain("between");
    expect(numberOperators).not.toContain("contains");
  });

  it("allows inclusion matching for multi-select option fields", () => {
    const multiSelectOperators = getOperatorsForValueType("enum");

    expect(multiSelectOperators).toEqual(["in"]);
  });

  it("uses symbol labels for number and text labels otherwise", () => {
    expect(getOperatorLabel("number", "gt")).toBe(">");
    expect(getOperatorLabel("date", "gte")).toBe("≧");
    expect(getOperatorLabel("text", "eq")).toBe("Es");
    expect(getOperatorLabel("enum", "in")).toBe("Es");
  });
});
