import { describe, expect, it } from "vitest";
import type { FilterCondition } from "../../../../search/shared/filterDefinition";
import {
  getStudentPresetNextConditions,
  isStudentPresetSelected,
} from "./studentPresetSync";

describe("useStudentFilters preset sync helpers", () => {
  it("marks career preset selected when TIND is included in the career filter", () => {
    const conditions: FilterCondition[] = [
      {
        id: "career",
        fieldKey: "career",
        operator: "in",
        value: ["Civil", "TIND"],
      },
    ];

    expect(isStudentPresetSelected("career", conditions)).toBe(true);
  });

  it("marks status preset selected when activo is included in the status filter", () => {
    const conditions: FilterCondition[] = [
      {
        id: "status",
        fieldKey: "status",
        operator: "in",
        value: ["activo", "inactivo"],
      },
    ];

    expect(isStudentPresetSelected("status", conditions)).toBe(true);
  });

  it("marks advertencia preset selected when reprobado is gt 2", () => {
    const conditions: FilterCondition[] = [
      {
        id: "reprobado",
        fieldKey: "reprobado",
        operator: "gt",
        value: 2,
      },
    ];

    expect(isStudentPresetSelected("advertencia", conditions)).toBe(true);
  });

  it("adds only TIND to an existing career multi-select filter", () => {
    const conditions: FilterCondition[] = [
      {
        id: "career",
        fieldKey: "career",
        operator: "in",
        value: ["Civil"],
      },
    ];

    const nextConditions = getStudentPresetNextConditions(conditions, "career");

    expect(nextConditions).toEqual([
      {
        id: "career",
        fieldKey: "career",
        operator: "in",
        value: ["Civil", "TIND"],
      },
    ]);
  });

  it("removes only activo from an existing status multi-select filter", () => {
    const conditions: FilterCondition[] = [
      {
        id: "status",
        fieldKey: "status",
        operator: "in",
        value: ["activo", "inactivo"],
      },
    ];

    const nextConditions = getStudentPresetNextConditions(conditions, "status");

    expect(nextConditions).toEqual([
      {
        id: "status",
        fieldKey: "status",
        operator: "in",
        value: ["inactivo"],
      },
    ]);
  });

  it("replaces a manual reprobado filter with advertencia", () => {
    const conditions: FilterCondition[] = [
      {
        id: "reprobado",
        fieldKey: "reprobado",
        operator: "eq",
        value: 1,
      },
    ];

    const nextConditions = getStudentPresetNextConditions(conditions, "advertencia");

    expect(nextConditions).toEqual([
      {
        id: "reprobado",
        fieldKey: "reprobado",
        operator: "gt",
        value: 2,
      },
    ]);
  });

  it("turns advertencia off by removing the reprobado condition", () => {
    const conditions: FilterCondition[] = [
      {
        id: "reprobado",
        fieldKey: "reprobado",
        operator: "gt",
        value: 2,
      },
    ];

    expect(getStudentPresetNextConditions(conditions, "advertencia")).toEqual([]);
  });
});