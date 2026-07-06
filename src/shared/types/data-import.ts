export const META_COLUMNS = [
  "ID",
  "Nombre",
  "Estatus",
  "Periodo",
] as const;

export const REGIONALES_COLUMN = "REGIONALES";

export const EXCEPT_COLUMNS = [
  "ASEM",
  "ALIN",
  "AING",
  "MING16",
  "MLIN16",
];

export const TINT_PATTERN = /^TINT\d+$/;
export const GRADE_PATTERN = /^\d+(\.\d+)?$/;
export const PERIOD_PATTERN = /^\d{6}$/;