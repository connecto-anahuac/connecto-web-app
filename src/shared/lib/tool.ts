
export function splitPeriod(period: string): { year: number; semesterNumber: number } {

  const year = Number(period.slice(0, 4));
  const semesterNumber = Number(period.slice(4));

  return { year, semesterNumber };
}

export function getOrdinalNumberPrefix(number: number): string { 
    let currentSemesterPrefix = "";
  switch (number) {
    case 1:
    case 3:
    case 11:
    case 13:
      currentSemesterPrefix = "ro";
      break;
    case 2:
      currentSemesterPrefix = "do";
      break;
    case 4:
    case 5:
    case 6:
    case 14:
    case 15:
    case 16:
    case 17:
      currentSemesterPrefix = "to";
      break;
    case 7:
    case 10:
    case 20:
      currentSemesterPrefix = "mo";
      break;
    case 8:
    case 12:
    case 18:
      currentSemesterPrefix = "vo";
      break;
    case 9:
    case 19:
      currentSemesterPrefix = "no";
      break;
    
  }
  return currentSemesterPrefix;
}