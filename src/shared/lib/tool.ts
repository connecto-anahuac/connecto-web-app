
export function splitPeriod(period: string): { year: number; semesterNumber: number } {

  const year = Number(period.slice(0, 4));
  const semesterNumber = Number(period.slice(4));

  return { year, semesterNumber };
}