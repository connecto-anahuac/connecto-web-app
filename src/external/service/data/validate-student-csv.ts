import type { ImportCsvValidationIssueDto } from "@/external/dto/data/import-csv-result.dto";
import {
  EXCEPT_COLUMNS,
  META_COLUMNS,
  REGIONALES_COLUMN,
  TINT_PATTERN,
} from "@/external/service/data/const";
import type { ParsedCsv } from "@/external/service/data/csv_parser";
import { isGrade, isPeriod } from "@/external/service/data/shared";

type StudentRow = {
  line: number;
  row: Record<string, string>;
};

const REGIONAL_COURSE_PATTERN = /^[A-Z]+\d+$/;

export function validateStudentCsv(
  parsed: ParsedCsv,
  fileName: string,
): ImportCsvValidationIssueDto[] {
  const issues: ImportCsvValidationIssueDto[] = [];
  const nonEmptyRows = parsed.rows
    .map((row, index) => ({ line: index + 2, row }))
    .filter(({ row }) => !isEmptyRow(row));

  if (parsed.headers.length === 0 || nonEmptyRows.length === 0) {
    issues.push(
      issue(fileName, "empty_csv", "El archivo CSV no contiene datos.", "error"),
    );
    return issues;
  }

  const unnamedSummaryColumns = getUnnamedSummaryColumns(parsed);

  for (const [renamedHeader, originalHeader] of Object.entries(
    parsed.renamedHeaders,
  )) {
    if (originalHeader === "" && unnamedSummaryColumns.has(renamedHeader)) {
      continue;
    }

    issues.push(
      issue(
        fileName,
        "duplicate_header",
        `La columna ${originalHeader} esta duplicada.`,
        "error",
        1,
        renamedHeader,
      ),
    );
  }

  parsed.headers.forEach((header) => {
    if (isUnnamedHeader(parsed, header) && !unnamedSummaryColumns.has(header)) {
      issues.push(
        issue(
          fileName,
          "invalid_header",
          "Las columnas sin nombre solo se permiten despues de MING16.",
          "error",
          1,
          header,
        ),
      );
    }
  });

  META_COLUMNS.forEach((header) => {
    if (!parsed.headers.includes(header)) {
      issues.push(
        issue(
          fileName,
          "missing_header",
          `Falta la columna obligatoria ${header}.`,
          "error",
          1,
          header,
        ),
      );
    }
  });

  const dataColumns = parsed.headers.filter(
    (header) =>
      !META_COLUMNS.includes(header as (typeof META_COLUMNS)[number]) &&
      !EXCEPT_COLUMNS.includes(header) &&
      !unnamedSummaryColumns.has(header),
  );

  if (dataColumns.length === 0) {
    issues.push(
      issue(
        fileName,
        "no_data_column",
        "El CSV no contiene columnas de materias o REGIONALES.",
        "error",
        1,
      ),
    );
  }

  parsed.errors.forEach((parseError) => {
    const row = parseError.row === undefined ? undefined : parsed.rows[parseError.row];
    if (
      parseError.code === "TooFewFields" &&
      row !== undefined &&
      isEmptyRow(row)
    ) {
      return;
    }

    issues.push(
      issue(
        fileName,
        "parse_error",
        parseError.message,
        "error",
        parseError.row === undefined ? undefined : parseError.row + 2,
      ),
    );
  });

  if (issues.some(({ severity }) => severity === "error")) {
    return issues;
  }

  const blocks: StudentRow[][] = [];
  let currentBlock: StudentRow[] | undefined;

  nonEmptyRows.forEach((studentRow) => {
    const id = normalize(studentRow.row.ID);

    if (id) {
      currentBlock = [studentRow];
      blocks.push(currentBlock);
      validateStudentStart(studentRow, fileName, issues);
      validateCourseCells(studentRow, dataColumns, fileName, issues);
      return;
    }

    if (!currentBlock) {
      issues.push(
        issue(
          fileName,
          "orphan_data",
          "Se encontraron datos antes de la primera fila de estudiante.",
          "error",
          studentRow.line,
          firstPopulatedColumn(studentRow.row, parsed.headers),
        ),
      );
      return;
    }

    currentBlock.push(studentRow);
    validateContinuationMetadata(studentRow, fileName, issues);
    validateCourseCells(studentRow, dataColumns, fileName, issues);
  });

  if (blocks.length === 0) {
    issues.push(
      issue(
        fileName,
        "no_student",
        "El CSV no contiene ninguna fila de estudiante con ID.",
        "error",
      ),
    );
  }

  if (parsed.headers.includes(REGIONALES_COLUMN)) {
    blocks.forEach((block) => validateRegionals(block, fileName, issues));
  }

  return issues;
}

function validateStudentStart(
  studentRow: StudentRow,
  fileName: string,
  issues: ImportCsvValidationIssueDto[],
) {
  const period = normalize(studentRow.row.Periodo);
  if (!period || !isPeriod(period)) {
    issues.push(
      issue(
        fileName,
        "invalid_period",
        "Periodo debe contener exactamente 6 digitos.",
        "error",
        studentRow.line,
        "Periodo",
      ),
    );
  }
}

function validateContinuationMetadata(
  studentRow: StudentRow,
  fileName: string,
  issues: ImportCsvValidationIssueDto[],
) {
  (["Nombre", "Estatus", "Periodo"] as const).forEach((column) => {
    if (normalize(studentRow.row[column])) {
      issues.push(
        issue(
          fileName,
          "invalid_continuation_metadata",
          `La columna ${column} solo puede tener valor en la fila inicial del estudiante.`,
          "error",
          studentRow.line,
          column,
        ),
      );
    }
  });
}

function validateCourseCells(
  studentRow: StudentRow,
  dataColumns: string[],
  fileName: string,
  issues: ImportCsvValidationIssueDto[],
) {
  dataColumns.forEach((column) => {
    if (column === REGIONALES_COLUMN || EXCEPT_COLUMNS.includes(column)) {
      return;
    }

    const value = normalize(studentRow.row[column]);
    if (!value) {
      return;
    }

    if (TINT_PATTERN.test(column)) {
      if (value !== "3") {
        issues.push(
          issue(
            fileName,
            "invalid_tint_value",
            "Este valor no activa TINT y sera ignorado por la importacion.",
            "warning",
            studentRow.line,
            column,
          ),
        );
      }
      return;
    }

    if (!isGrade(value) && !isPeriod(value)) {
      issues.push(
        issue(
          fileName,
          "invalid_course_value",
          "Este valor no es una calificacion ni un periodo y sera ignorado.",
          "warning",
          studentRow.line,
          column,
        ),
      );
    }
  });
}

function validateRegionals(
  block: StudentRow[],
  fileName: string,
  issues: ImportCsvValidationIssueDto[],
) {
  const tokens = block
    .map(({ line, row }) => ({ line, value: normalize(row[REGIONALES_COLUMN]) }))
    .filter((token): token is { line: number; value: string } => Boolean(token.value));

  let index = 0;
  while (index < tokens.length) {
    const current = tokens[index];
    if (!REGIONAL_COURSE_PATTERN.test(current.value)) {
      issues.push(
        issue(
          fileName,
          "invalid_regionales",
          "Este valor de REGIONALES no pertenece a una materia y sera ignorado.",
          "warning",
          current.line,
          REGIONALES_COLUMN,
        ),
      );
      index += 1;
      continue;
    }

    index += 1;
    if (index < tokens.length && isGrade(tokens[index].value)) {
      index += 1;
    }

    if (index >= tokens.length) {
      continue;
    }

    if (isPeriod(tokens[index].value)) {
      index += 1;
      continue;
    }

    const combined = tokens[index].value.split(" ");
    if (combined.length === 2 && isPeriod(combined[0])) {
      tokens[index] = { line: tokens[index].line, value: combined[1] };
    }
  }
}

function isEmptyRow(row: Record<string, string>): boolean {
  return Object.values(row).every((value) => {
    if (Array.isArray(value)) {
      return value.every((item) => normalize(item) === null);
    }
    return normalize(value) === null;
  });
}

function firstPopulatedColumn(
  row: Record<string, string>,
  headers: string[],
): string | undefined {
  return headers.find((header) => normalize(row[header]));
}

function normalize(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const text = String(value).trim();
  return text.length === 0 ? null : text;
}

function getUnnamedSummaryColumns(parsed: ParsedCsv): Set<string> {
  const summaryStart = parsed.headers.indexOf("MING16");
  if (summaryStart === -1) {
    return new Set();
  }

  return new Set(
    parsed.headers.filter(
      (header, index) =>
        index > summaryStart && isUnnamedHeader(parsed, header),
    ),
  );
}

function isUnnamedHeader(parsed: ParsedCsv, header: string): boolean {
  return header === "" || parsed.renamedHeaders[header] === "";
}

function issue(
  fileName: string,
  code: ImportCsvValidationIssueDto["code"],
  message: string,
  severity: ImportCsvValidationIssueDto["severity"],
  row?: number,
  column?: string,
): ImportCsvValidationIssueDto {
  return { code, column, fileName, message, row, severity };
}
