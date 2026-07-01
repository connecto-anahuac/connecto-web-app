import Papa from "papaparse";

export async function parseCsv(
  file: File,
): Promise<Record<string, string>[]> {
  const text = await file.text();

  const result = Papa.parse<
    Record<string, string>
  >(text, {
    header: true,
    skipEmptyLines: false,
  });

  return result.data;
}