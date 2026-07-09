"use client";

import type { ImportCsvResultDto } from "@/external/dto/data/import-csv-result.dto";
import { parseCsv } from "@/external/service/data/csv_parser";
import { processStudentCsv } from "@/external/service/data/process_student";
import { upsertWholeBulk } from "@/external/service/data/upsert-whole-bulk";

export async function importCsvClient(
  formData: FormData,
): Promise<ImportCsvResultDto> {
  const file = formData.get("file");
  const career = formData.get("career");

  if (!(file instanceof File)) {
    throw new Error("File not found");
  }

  if (typeof career !== "string" || career.trim().length === 0) {
    throw new Error("Career not found");
  }

  const rows = await parseCsv(file);
  const result = await processStudentCsv(rows, career);

  await upsertWholeBulk({
    students: result.students,
    grades: result.grades,
  });

  return {
    studentsCount: result.students.length,
    gradesCount: result.grades.length,
  };
}