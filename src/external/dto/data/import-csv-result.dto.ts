export const IMPORT_CSV_ERROR_CODES = [
  "empty_csv",
  "missing_header",
  "duplicate_header",
  "invalid_header",
  "no_data_column",
  "parse_error",
  "no_student",
  "orphan_data",
  "invalid_continuation_metadata",
  "invalid_period",
  "invalid_course_value",
  "invalid_tint_value",
  "invalid_regionales",
  "unsupported_file_type",
  "import_failed",
] as const;

export type ImportCsvErrorCode = (typeof IMPORT_CSV_ERROR_CODES)[number];

export type ImportCsvValidationIssueDto = {
  code: ImportCsvErrorCode;
  column?: string;
  fileName: string;
  message: string;
  row?: number;
  severity: "error" | "warning";
};

export type ImportCsvResultDto =
  | {
      fileName: string;
      gradesCount: number;
      issues: ImportCsvValidationIssueDto[];
      status: "success";
      studentsCount: number;
    }
  | {
      fileName: string;
      issues: ImportCsvValidationIssueDto[];
      status: "validation-error";
    };
