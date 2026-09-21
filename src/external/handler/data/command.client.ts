"use client";

import type { ImportCsvResultDto } from "@/external/dto/data/import-csv-result.dto";
import { parseCsv } from "@/external/service/data/csv_parser";
import { processStudentCsv } from "@/external/service/data/process_student";
import { upsertWholeBulk } from "@/external/service/data/upsert-whole-bulk";
import { validateStudentCsv } from "@/external/service/data/validate-student-csv";

export async function importCsvClient(
  formData: FormData,
): Promise<ImportCsvResultDto> {
  const file = formData.get("file");
  const career = formData.get("career");
  const fileType = formData.get("fileType");

  if (!(file instanceof File)) {
    throw new Error("File not found");
  }

  if (typeof career !== "string" || career.trim().length === 0) {
    throw new Error("Career not found");
  }

  if (fileType !== "CAPP") {
    return {
      fileName: file.name,
      issues: [
        {
          code: "unsupported_file_type",
          fileName: file.name,
          message: "La importacion de Plan de Estudios aun no esta disponible.",
          severity: "error",
        },
      ],
      status: "validation-error",
    };
  }

  const parsed = await parseCsv(file);
  const issues = validateStudentCsv(parsed, file.name);
  if (issues.some(({ severity }) => severity === "error")) {
    return {
      fileName: file.name,
      issues,
      status: "validation-error",
    };
  }

  const result = await processStudentCsv(parsed.rows, career);

  await upsertWholeBulk({
    students: result.students,
    grades: result.grades,
  });

  return {
    fileName: file.name,
    studentsCount: result.students.length,
    gradesCount: result.grades.length,
    issues,
    status: "success",
  };
}
