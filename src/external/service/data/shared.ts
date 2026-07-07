import { GRADE_PATTERN, PERIOD_PATTERN } from "./const";




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
