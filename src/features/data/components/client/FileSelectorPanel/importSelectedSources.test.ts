import { File } from "node:buffer";
import { describe, expect, it, vi } from "vitest";
import type { UploadSource } from "@/features/data/types/file";
import { importSelectedSources } from "./importSelectedSources";

function source(name: string): UploadSource {
  return {
    career: "Industrial",
    error: false,
    file: new File(["csv"], name, { type: "text/csv" }) as unknown as globalThis.File,
    fileType: "CAPP",
    grades: 0,
    id: `source-${name}`,
    isCompleted: false,
    issues: [],
    students: 0,
  };
}

describe("importSelectedSources", () => {
  it("continues after validation errors and aggregates only successful counts", async () => {
    const importer = vi
      .fn()
      .mockResolvedValueOnce({
        fileName: "valid.csv",
        gradesCount: 4,
        issues: [
          {
            code: "invalid_course_value",
            column: "EMP1401",
            fileName: "valid.csv",
            message: "ignored",
            row: 2,
            severity: "warning",
          },
        ],
        status: "success",
        studentsCount: 2,
      })
      .mockResolvedValueOnce({
        fileName: "invalid.csv",
        issues: [
          {
            code: "missing_header",
            column: "ID",
            fileName: "invalid.csv",
            message: "missing ID",
            row: 1,
            severity: "error",
          },
        ],
        status: "validation-error",
      })
      .mockResolvedValueOnce({
        fileName: "another-valid.csv",
        gradesCount: 3,
        issues: [],
        status: "success",
        studentsCount: 1,
      });

    const result = await importSelectedSources(
      [source("valid.csv"), source("invalid.csv"), source("another-valid.csv")],
      importer,
    );

    expect(importer).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      grades: 7,
      issues: [
        expect.objectContaining({
          code: "invalid_course_value",
          fileName: "valid.csv",
          severity: "warning",
        }),
        expect.objectContaining({
          code: "missing_header",
          fileName: "invalid.csv",
          severity: "error",
        }),
      ],
      sourceResults: {
        "source-another-valid.csv": {
          error: false,
          grades: 3,
          isCompleted: true,
          issues: [],
          students: 1,
        },
        "source-invalid.csv": {
          error: true,
          grades: 0,
          isCompleted: false,
          issues: [expect.objectContaining({ severity: "error" })],
          students: 0,
        },
        "source-valid.csv": {
          error: false,
          grades: 4,
          isCompleted: true,
          issues: [expect.objectContaining({ severity: "warning" })],
          students: 2,
        },
      },
      students: 3,
    });
  });

  it("turns an unexpected per-file failure into an issue and continues", async () => {
    const importer = vi
      .fn()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce({
        fileName: "valid.csv",
        gradesCount: 1,
        issues: [],
        status: "success",
        studentsCount: 1,
      });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await importSelectedSources(
      [source("failed.csv"), source("valid.csv")],
      importer,
    );

    expect(importer).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      grades: 1,
      issues: [
        expect.objectContaining({
          code: "import_failed",
          fileName: "failed.csv",
          severity: "error",
        }),
      ],
      sourceResults: {
        "source-failed.csv": {
          error: true,
          grades: 0,
          isCompleted: false,
          issues: [expect.objectContaining({ code: "import_failed", severity: "error" })],
          students: 0,
        },
        "source-valid.csv": {
          error: false,
          grades: 1,
          isCompleted: true,
          issues: [],
          students: 1,
        },
      },
      students: 1,
    });
  });

  it("does not complete a success response containing an error issue", async () => {
    const result = await importSelectedSources([source("partially-invalid.csv")], vi.fn().mockResolvedValue({
      fileName: "partially-invalid.csv",
      gradesCount: 2,
      issues: [
        {
          code: "invalid_course_value",
          fileName: "partially-invalid.csv",
          message: "invalid course",
          severity: "error",
        },
      ],
      status: "success",
      studentsCount: 1,
    }));

    expect(result).toMatchObject({ grades: 0, students: 0 });
    expect(result.sourceResults["source-partially-invalid.csv"]).toMatchObject({
      error: true,
      grades: 0,
      isCompleted: false,
      students: 0,
    });
  });

  it("keeps same-named sources separate by source id", async () => {
    const first = { ...source("duplicate.csv"), id: "first" };
    const second = { ...source("duplicate.csv"), id: "second" };
    const result = await importSelectedSources(
      [first, second],
      vi
        .fn()
        .mockResolvedValueOnce({
          fileName: "duplicate.csv",
          gradesCount: 1,
          issues: [],
          status: "success",
          studentsCount: 1,
        })
        .mockResolvedValueOnce({
          fileName: "duplicate.csv",
          issues: [
            {
              code: "missing_header",
              fileName: "duplicate.csv",
              message: "missing header",
              severity: "error",
            },
          ],
          status: "validation-error",
        }),
    );

    expect(result.sourceResults.first).toMatchObject({ isCompleted: true, error: false });
    expect(result.sourceResults.second).toMatchObject({ isCompleted: false, error: true });
  });
});
