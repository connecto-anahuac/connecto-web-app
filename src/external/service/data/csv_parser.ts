import Papa from "papaparse";
import type { ParseError } from "papaparse";

export type ParsedCsv = {
  errors: ParseError[];
  headers: string[];
  renamedHeaders: Record<string, string>;
  rows: Record<string, string>[];
};

export async function parseCsv(
  file: File,
): Promise<ParsedCsv> {
  const text = await file.text();

  const result = Papa.parse<
    Record<string, string>
  >(text, {
    header: true,
    skipEmptyLines: false,
  });

  return {
    errors: result.errors,
    headers: result.meta.fields ?? [],
    renamedHeaders: result.meta.renamedHeaders ?? {},
    rows: result.data,
  };
}
