// "use server";

import path from "path";
import { parseCsv } from "../parser/csv_parser";
import { processStudentCsv } from "../process_student";
import { upsertWholeBulk } from "@/infra/local/updater";

const OUTPUT_DIR = process.env.OUTPUT_DIR ?? path.join(process.cwd(), "output");

export async function importCsvAction(formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("File not found");
  }

  const rows = await parseCsv(file);

  const result = await processStudentCsv(rows, file.name, OUTPUT_DIR);

  await upsertWholeBulk({
    students: result.students,
    grades: result.grades,
  });

  return {
    studentsCount: result.students.length,

    gradesCount: result.grades.length,
  };
}
