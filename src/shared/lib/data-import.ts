import { CARRERAS } from "@/shared/types/consts";
import { GRADE_PATTERN, PERIOD_PATTERN } from "@/shared/types/data-import";

export function normalize(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const text = String(value).trim();

  return text === "" ? null : text;
}

export function isGrade(value: string | null): boolean {
  if (!value) return false;

  if (!GRADE_PATTERN.test(value)) {
    return false;
  }

  const num = Number(value);

  return !Number.isNaN(num) && num <= 10;
}

export function isPeriod(value: string | null): boolean {
  if (!value) return false;

  return PERIOD_PATTERN.test(value);
}

export function getCareerName(fileName: string): string | null {
  return (
    CARRERAS.find((career) =>
      fileName.toLowerCase().includes(career.toLowerCase()),
    ) ?? null
  );
}