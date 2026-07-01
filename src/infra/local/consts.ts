export const CAPP_META_COLUMNS = {
  id: "ID",
  name: "Nombre",
  status: "Estatus",
  period: "Periodo",
} as const;

export const REGIONALES_COLUMN = "REGIONALES";

export const AS_VALUE = {
  default: "default",
  tint: "TINT",
  regionales: "REGIONALES",
}

//　skip these columns to output.json
export const EXCEPT_COLUMNS = [
  "ASEM",
  "ALIN",
  "AING",
  "MING16",
  "MLIN16",
];

export const CARRERAS = [
  "Industrial",
  "Ambiental",
  "TIND",
  "Civil",
];

export const TINT_PATTERN = /^TINT\d+$/;
export const GRADE_PATTERN = /^\d+(\.\d+)?$/;
export const PERIOD_PATTERN = /^\d{6}$/;