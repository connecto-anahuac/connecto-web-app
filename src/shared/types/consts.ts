export const NULL_DATA_STRING = "--";
export const GRADE_NOT_FOUND_VALUE = -1;
export const PERIOD_NOT_FOUND_VALUE = "500060";
export const PASS_GRADE = 6;

export const CARRERAS = [
  "Industrial",
  "Ambiental",
  "TIND",
  "Civil",
];


export enum StudentStatus {
  ACTIVE = "activo",
  INACTIVE = "inactivo",
  BAJA_ACADEMICA = "baja academica",
  BAJA_VOLUNTARIA = "baja voluntaria",
}

export type DATA_CACHE_ID = "studentGrade" | "student" | "professor" | "class";


export type AlertLevel="high"|"medium"|"low";