// "use server";
"use client";
import path from "path";
import { upsertWholeBulk } from "@/infra/local/updater";
import { parseCsv } from "@/external/service/data/csv_parser";
import { processStudentCsv } from "@/external/service/data/process_student";

const outputDirectory =
  process.env.OUTPUT_DIR ?? path.join(process.cwd(), "output");

export type ImportCsvResult = {
  gradesCount: number;
  studentsCount: number;
};

export async function importCsvAction(formData: FormData): Promise<ImportCsvResult> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("File not found");
  }

  const rows = await parseCsv(file);
  const result = await processStudentCsv(rows, file.name, outputDirectory);

  await upsertWholeBulk({
    students: result.students,
    grades: result.grades,
  });

  return {
    studentsCount: result.students.length,
    gradesCount: result.grades.length,
  };
}