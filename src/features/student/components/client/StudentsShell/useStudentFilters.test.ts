import { describe, expect, it } from "vitest";
import type { FilterCondition } from "../../../../../shared/service/dataPipeline/filterDefinition";
import {
  getStudentPresetNextConditions,
  isStudentPresetSelected,
} from "./studentPresetSync";
import { STUDENT_FILTER_KEYS, STUDENT_STATUS_OPTIONS } from "@/features/student/types/deprecated/studentFilterConfigs";

describe("useStudentFilters preset sync helpers", () => {
  it("marks career preset selected when TIND is included in the career filter", () => {
    const conditions: FilterCondition[] = [
      {
        // 
        fieldId: STUDENT_FILTER_KEYS.career,
        operator: "in",
        value: ["Civil", "TIND"],
      },
    ];

    expect(isStudentPresetSelected("career", conditions)).toBe(true);
  });

  it("marks status preset selected when activo is included in the status filter", () => {
    const conditions: FilterCondition[] = [
      {
        // id: STUDENT_FILTER_KEYS.status,
        fieldId: STUDENT_FILTER_KEYS.status,
        operator: "in",
        value: [STUDENT_STATUS_OPTIONS[0].value, STUDENT_STATUS_OPTIONS[1].value],
      },
    ];

    expect(isStudentPresetSelected("status", conditions)).toBe(true);
  });

  it("marks advertencia preset selected when reprobado is gt 2", () => {
    const conditions: FilterCondition[] = [
      {
       
        fieldId: STUDENT_FILTER_KEYS.failCount,
        operator: "gt",
        value: 2,
      },
    ];

    expect(isStudentPresetSelected("advertencia", conditions)).toBe(true);
  });

  it("adds only TIND to an existing career multi-select filter", () => {
    const conditions: FilterCondition[] = [
      {
        
        fieldId: STUDENT_FILTER_KEYS.career,
        operator: "in",
        value: ["Civil"],
      },
    ];

    const nextConditions = getStudentPresetNextConditions(conditions, "career");

    expect(nextConditions).toEqual([
      {
        
        columnId: STUDENT_FILTER_KEYS.career,
        operator: "in",
        value: ["Civil", "TIND"],
      },
    ]);
  });

  it("removes only activo from an existing status multi-select filter", () => {
    const conditions: FilterCondition[] = [
      {
        // id: STUDENT_FILTER_KEYS.status,
        fieldId: STUDENT_FILTER_KEYS.status,
        operator: "in",
        value: [STUDENT_STATUS_OPTIONS[0].value, STUDENT_STATUS_OPTIONS[1].value],
      },
    ];

    const nextConditions = getStudentPresetNextConditions(conditions, "status");

    expect(nextConditions).toEqual([
      {
        columnId: STUDENT_FILTER_KEYS.status,
        operator: "in",
        value: [STUDENT_STATUS_OPTIONS[1].value],
      },
    ]);
  });

  it("replaces a manual reprobado filter with advertencia", () => {
    const conditions: FilterCondition[] = [
      {
       
        fieldId: STUDENT_FILTER_KEYS.failCount,
        operator: "eq",
        value: 1,
      },
    ];

    const nextConditions = getStudentPresetNextConditions(conditions, "advertencia");

    expect(nextConditions).toEqual([
      {
       
        columnId: STUDENT_FILTER_KEYS.failCount,
        operator: "gt",
        value: 2,
      },
    ]);
  });

  it("turns advertencia off by removing the reprobado condition", () => {
    const conditions: FilterCondition[] = [
      {
       
        fieldId: STUDENT_FILTER_KEYS.failCount,
        operator: "gt",
        value: 2,
      },
    ];

    expect(getStudentPresetNextConditions(conditions, "advertencia")).toEqual([]);
  });
});
