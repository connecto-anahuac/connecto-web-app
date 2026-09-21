import { describe, expect, it } from "vitest";
import type { ParsedCsv } from "./csv_parser";
import { validateStudentCsv } from "./validate-student-csv";

function parsedCsv(
  headers: string[],
  rows: Record<string, string>[],
  overrides: Partial<ParsedCsv> = {},
): ParsedCsv {
  return {
    errors: [],
    headers,
    renamedHeaders: {},
    rows,
    ...overrides,
  };
}

describe("validateStudentCsv", () => {
  it("accepts dynamic course columns, continuation rows, regionals, and blank rows", () => {
    const parsed = parsedCsv(
      [
        "ID",
        "Nombre",
        "Estatus",
        "Periodo",
        "HUM1401",
        "FIS1401P",
        "TINT1401",
        "REGIONALES",
        "ASEM",
      ],
      [
        {
          ID: "423336",
          Nombre: "Alma",
          Estatus: "Activo",
          Periodo: "202560",
          HUM1401: "8.5",
          FIS1401P: "202610",
          TINT1401: "3",
          REGIONALES: "MAT1401",
          ASEM: "anything",
        },
        {
          ID: "",
          Nombre: "",
          Estatus: "",
          Periodo: "",
          HUM1401: "202560",
          FIS1401P: "",
          TINT1401: "",
          REGIONALES: "9.5",
          ASEM: "",
        },
        { ID: "" },
        {
          ID: "",
          Nombre: "",
          Estatus: "",
          Periodo: "",
          HUM1401: "",
          FIS1401P: "",
          TINT1401: "",
          REGIONALES: "202560",
          ASEM: "",
        },
      ],
      {
        errors: [
          {
            code: "TooFewFields",
            message: "Too few fields",
            row: 2,
            type: "FieldMismatch",
          },
        ],
      },
    );

    expect(validateStudentCsv(parsed, "CAPP.csv")).toEqual([]);
  });

  it("reports missing and duplicated headers", () => {
    const parsed = parsedCsv(["ID", "Nombre", "Periodo", "HUM1401_1"], [
      { ID: "1", Nombre: "A", Periodo: "202560", HUM1401_1: "8" },
    ], {
      renamedHeaders: { HUM1401_1: "HUM1401" },
    });

    expect(validateStudentCsv(parsed, "bad.csv")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "duplicate_header", row: 1 }),
        expect.objectContaining({
          code: "missing_header",
          column: "Estatus",
          severity: "error",
        }),
      ]),
    );
  });

  it("rejects orphan data and invalid student periods", () => {
    const parsed = parsedCsv(
      ["ID", "Nombre", "Estatus", "Periodo", "HUM1401"],
      [
        { ID: "", Nombre: "", Estatus: "", Periodo: "", HUM1401: "8" },
        { ID: "1", Nombre: "A", Estatus: "Activo", Periodo: "2025", HUM1401: "" },
      ],
    );

    expect(validateStudentCsv(parsed, "bad.csv")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "orphan_data", row: 2, column: "HUM1401" }),
        expect.objectContaining({ code: "invalid_period", row: 3, column: "Periodo" }),
      ]),
    );
  });

  it("rejects metadata values on continuation rows", () => {
    const parsed = parsedCsv(
      ["ID", "Nombre", "Estatus", "Periodo", "HUM1401"],
      [
        { ID: "1", Nombre: "A", Estatus: "Activo", Periodo: "202560", HUM1401: "8" },
        { ID: "", Nombre: "Duplicated", Estatus: "", Periodo: "", HUM1401: "202610" },
      ],
    );

    expect(validateStudentCsv(parsed, "bad.csv")).toContainEqual(
      expect.objectContaining({
        code: "invalid_continuation_metadata",
        column: "Nombre",
        row: 3,
      }),
    );
  });

  it("rejects a file without a student ID", () => {
    const parsed = parsedCsv(
      ["ID", "Nombre", "Estatus", "Periodo", "HUM1401"],
      [{ ID: "", Nombre: "", Estatus: "", Periodo: "", HUM1401: "8" }],
    );

    expect(validateStudentCsv(parsed, "bad.csv")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "orphan_data" }),
        expect.objectContaining({ code: "no_student" }),
      ]),
    );
  });

  it("warns about ignored course, TINT, and REGIONALES values with locations", () => {
    const parsed = parsedCsv(
      ["ID", "Nombre", "Estatus", "Periodo", "HUM1401", "TINT1401", "REGIONALES"],
      [
        {
          ID: "1",
          Nombre: "A",
          Estatus: "Activo",
          Periodo: "202560",
          HUM1401: "11",
          TINT1401: "2",
          REGIONALES: "9",
        },
      ],
    );

    expect(validateStudentCsv(parsed, "bad.csv")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid_course_value", row: 2, column: "HUM1401", severity: "warning" }),
        expect.objectContaining({ code: "invalid_tint_value", row: 2, column: "TINT1401", severity: "warning" }),
        expect.objectContaining({ code: "invalid_regionales", row: 2, column: "REGIONALES", severity: "warning" }),
      ]),
    );
  });

  it("allows unnamed summary columns after MING16", () => {
    const parsed = parsedCsv(
      ["ID", "Nombre", "Estatus", "Periodo", "HUM1401", "MING16", "", "_1", "MLIN16"],
      [
        {
          ID: "1",
          Nombre: "A",
          Estatus: "Activo",
          Periodo: "202560",
          HUM1401: "8",
          MING16: "",
          "": "",
          _1: "364.5",
          MLIN16: "12",
        },
      ],
      { renamedHeaders: { _1: "" } },
    );

    expect(validateStudentCsv(parsed, "summary.csv")).toEqual([]);
  });

  it("rejects unnamed columns before MING16", () => {
    const parsed = parsedCsv(
      ["ID", "Nombre", "Estatus", "Periodo", "", "HUM1401", "MING16"],
      [
        {
          ID: "1",
          Nombre: "A",
          Estatus: "Activo",
          Periodo: "202560",
          "": "ignored",
          HUM1401: "8",
          MING16: "",
        },
      ],
    );

    expect(validateStudentCsv(parsed, "bad.csv")).toContainEqual(
      expect.objectContaining({ code: "invalid_header", severity: "error" }),
    );
  });

  it("rejects non-empty rows with parser field mismatches", () => {
    const parsed = parsedCsv(
      ["ID", "Nombre", "Estatus", "Periodo", "HUM1401"],
      [{ ID: "1", Nombre: "A", Estatus: "Activo", Periodo: "202560", HUM1401: "8" }],
      {
        errors: [
          {
            code: "TooManyFields",
            message: "Too many fields",
            row: 0,
            type: "FieldMismatch",
          },
        ],
      },
    );

    expect(validateStudentCsv(parsed, "bad.csv")).toContainEqual(
      expect.objectContaining({ code: "parse_error", row: 2 }),
    );
  });
});
