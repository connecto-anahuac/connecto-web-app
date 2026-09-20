import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseCsv } from "./csv_parser";
import { validateStudentCsv } from "./validate-student-csv";

function textFile(text: string): File {
  return { text: async () => text } as File;
}

describe("parseCsv and validateStudentCsv", () => {
  it("accepts a comma-separated CAPP file", async () => {
    const parsed = await parseCsv(
      textFile(
        [
          "ID,Nombre,Estatus,Periodo,HUM1401,REGIONALES",
          "423336,Alma,Activo,202560,8.5,MAT1401",
          ",,,,202610,9.5",
          ",,,,,202560",
        ].join("\n"),
      ),
    );

    expect(validateStudentCsv(parsed, "CAPP_Industrial.csv")).toEqual([]);
  });

  it("accepts a tab-separated CAPP file with blank spacer rows", async () => {
    const parsed = await parseCsv(
      textFile(
        [
          "ID\tNombre\tEstatus\tPeriodo\tHUM1401\tTINT1401",
          "588018\tAiker\tActivo\t202560\t9.2\t3",
          "\t\t\t\t202610\t",
          "",
          "",
          "486310\tValentina\tActivo\t202260\t9.7\t3",
        ].join("\n"),
      ),
    );

    expect(validateStudentCsv(parsed, "CAPP_Ambiental.csv")).toEqual([]);
  });

  it("accepts every production CAPP fixture without blocking errors", async () => {
    const fixtureDirectory = join(process.cwd(), "public", "dev_untrack", "test");
    const expectedWarningCounts: Record<string, number> = {
      "CAPP_CIVIL_202640.csv": 3,
      "CAPP_IAMB_202640.csv": 0,
      "CAPP_IIND_202640.csv": 4,
      "CAPP_TIND_202640.csv": 7,
    };
    const fileNames = readdirSync(fixtureDirectory)
      .filter((fileName) => fileName.toLowerCase().endsWith(".csv"))
      .sort();

    expect(fileNames).toEqual(Object.keys(expectedWarningCounts).sort());

    for (const fileName of fileNames) {
      const text = readFileSync(join(fixtureDirectory, fileName), "utf8");
      const parsed = await parseCsv(textFile(text));
      const issues = validateStudentCsv(parsed, fileName);

      expect(
        issues.filter(({ severity }) => severity === "error"),
        `${fileName} should not have blocking errors`,
      ).toEqual([]);
      expect(
        issues.filter(({ severity }) => severity === "warning"),
        `${fileName} warning count changed`,
      ).toHaveLength(expectedWarningCounts[fileName]);
    }
  });
});
