import { CARRERAS, GRADE_PATTERN, PERIOD_PATTERN } from "./consts";


export function normalize(
  value: unknown,
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const text = String(value).trim();

  return text === "" ? null : text;
}

export function isGrade(
  value: string | null,
): boolean {
  if (!value) return false;

  if (!GRADE_PATTERN.test(value)) {
    return false;
  }

  const num = Number(value);

  return !isNaN(num) && num <= 10;
}

export function isPeriod(
  value: string | null,
): boolean {
  if (!value) return false;

  return PERIOD_PATTERN.test(value);
}

export function getCarreraName(
  fileName: string,
): string | null {


  return (
    CARRERAS.find((c) =>
      fileName.toLowerCase().includes(
        c.toLowerCase(),
      ),
    ) ?? null
  );
}