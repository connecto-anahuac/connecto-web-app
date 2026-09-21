import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  parseCsv: vi.fn(),
  processStudentCsv: vi.fn(),
  upsertWholeBulk: vi.fn(),
  validateStudentCsv: vi.fn(),
}));

vi.mock("@/external/service/data/csv_parser", () => ({
  parseCsv: mocks.parseCsv,
}));
vi.mock("@/external/service/data/process_student", () => ({
  processStudentCsv: mocks.processStudentCsv,
}));
vi.mock("@/external/service/data/upsert-whole-bulk", () => ({
  upsertWholeBulk: mocks.upsertWholeBulk,
}));
vi.mock("@/external/service/data/validate-student-csv", () => ({
  validateStudentCsv: mocks.validateStudentCsv,
}));

class TestFile {
  constructor(public readonly name: string) {}
}

function formData(fileType: "CAPP" | "Plan de Estudios") {
  const values = new Map<string, unknown>([
    ["file", new TestFile("students.csv")],
    ["career", "Industrial"],
    ["fileType", fileType],
  ]);

  return { get: (key: string) => values.get(key) ?? null } as unknown as FormData;
}

describe("importCsvClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("File", TestFile);
  });

  it("returns an unsupported error for Plan de Estudios without parsing it", async () => {
    const { importCsvClient } = await import("./command.client");

    await expect(importCsvClient(formData("Plan de Estudios"))).resolves.toEqual(
      expect.objectContaining({
        status: "validation-error",
        issues: [
          expect.objectContaining({
            code: "unsupported_file_type",
            severity: "error",
          }),
        ],
      }),
    );
    expect(mocks.parseCsv).not.toHaveBeenCalled();
  });

  it("does not transform or persist an invalid CAPP file", async () => {
    const parsed = { errors: [], headers: [], renamedHeaders: {}, rows: [] };
    const issues = [
      {
        code: "empty_csv",
        fileName: "students.csv",
        message: "empty",
        severity: "error",
      },
    ];
    mocks.parseCsv.mockResolvedValue(parsed);
    mocks.validateStudentCsv.mockReturnValue(issues);
    const { importCsvClient } = await import("./command.client");

    await expect(importCsvClient(formData("CAPP"))).resolves.toEqual({
      fileName: "students.csv",
      issues,
      status: "validation-error",
    });
    expect(mocks.processStudentCsv).not.toHaveBeenCalled();
    expect(mocks.upsertWholeBulk).not.toHaveBeenCalled();
  });

  it("uses the unchanged transformer and persists a valid CAPP file", async () => {
    const rows = [{ ID: "1" }];
    mocks.parseCsv.mockResolvedValue({
      errors: [],
      headers: ["ID"],
      renamedHeaders: {},
      rows,
    });
    mocks.validateStudentCsv.mockReturnValue([]);
    mocks.processStudentCsv.mockResolvedValue({
      grades: [{ courseKey: "HUM1401" }],
      students: [{ id: "1" }],
    });
    const { importCsvClient } = await import("./command.client");

    await expect(importCsvClient(formData("CAPP"))).resolves.toEqual({
      fileName: "students.csv",
      gradesCount: 1,
      issues: [],
      status: "success",
      studentsCount: 1,
    });
    expect(mocks.processStudentCsv).toHaveBeenCalledWith(rows, "Industrial");
    expect(mocks.upsertWholeBulk).toHaveBeenCalledWith({
      grades: [{ courseKey: "HUM1401" }],
      students: [{ id: "1" }],
    });
  });

  it("transforms and persists a CAPP file that only has warnings", async () => {
    const rows = [{ ID: "1" }];
    const warnings = [
      {
        code: "invalid_course_value",
        column: "EMP1401",
        fileName: "students.csv",
        message: "ignored",
        row: 2,
        severity: "warning",
      },
    ];
    mocks.parseCsv.mockResolvedValue({
      errors: [],
      headers: ["ID"],
      renamedHeaders: {},
      rows,
    });
    mocks.validateStudentCsv.mockReturnValue(warnings);
    mocks.processStudentCsv.mockResolvedValue({ grades: [], students: [{ id: "1" }] });
    const { importCsvClient } = await import("./command.client");

    await expect(importCsvClient(formData("CAPP"))).resolves.toEqual({
      fileName: "students.csv",
      gradesCount: 0,
      issues: warnings,
      status: "success",
      studentsCount: 1,
    });
    expect(mocks.processStudentCsv).toHaveBeenCalledWith(rows, "Industrial");
    expect(mocks.upsertWholeBulk).toHaveBeenCalledTimes(1);
  });
});
