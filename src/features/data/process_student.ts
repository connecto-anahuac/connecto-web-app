import {
  META_COLUMNS,
  EXCEPT_COLUMNS,
  REGIONALES_COLUMN,
  TINT_PATTERN,
} from "./domain/consts";

import {
  normalize,
  isGrade,
  isPeriod,
} from "./domain/validator";

//  import { GradeEntity, StudentEntity } from "./domain/types";
import { extractRegionals } from "./extractor/regionals_extractor";
import { GradeEntity, StudentEntity } from "@/infra/local/entities";
import { NULL_DATA_STRING } from "@/types/consts";


export async function processStudentCsv(
  rows: Record<string, string>[],
  _fileName: string,
  _outputDir: string,
) : Promise<{ students: StudentEntity[]; grades: GradeEntity[] }> {
  void _fileName;
  void _outputDir;

  const students: StudentEntity[] = [];
  const grades: GradeEntity[] = [];

  const columns = Object.keys(rows[0]);

  const classColumns = columns.filter(
    (c) => !META_COLUMNS.includes(c as never),
  );

  //  --------------------------------------------------
  //  extract student blocks
  //  --------------------------------------------------

  const studentStartRows: number[] = [];

  rows.forEach((row, idx) => {
    if (normalize(row.ID)) {
      studentStartRows.push(idx);
    }
  });

  studentStartRows.push(rows.length);

  //  --------------------------------------------------
  //  extract data from each student block
  //  --------------------------------------------------

  for (let i = 0; i < studentStartRows.length - 1; i++) {
    const start = studentStartRows[i];
    const end = studentStartRows[i + 1];

    const block = rows.slice(start, end);

    const firstRow = block[0];

    const studentId = normalize(firstRow.ID);
    if (!studentId) {
      console.warn(`Skipping student block at index ${start} due to missing ID`);
      continue;
    }

    const studentGrades: GradeEntity[] = [];
    const uniquePeriods = new Set<string>();

    //  --------------------------------------------------
    //  process of normal materials
    //  --------------------------------------------------
    for (const classCode of classColumns) {
      if (EXCEPT_COLUMNS.includes(classCode)) {
        continue;
      }

      if (classCode === REGIONALES_COLUMN) {
        continue;
      }

      //  --------------------------------------------------
      //  process of TINT
      //  --------------------------------------------------
      if (TINT_PATTERN.test(classCode)) {
        const found = block.some((row) => normalize(row[classCode]) === "3");

        studentGrades.push({
          studentId: studentId,
          materiaKey: classCode,
          as: "TINT",
          value: found,
          period: null,
          grade: null,
        });

        continue;
      }

      //  --------------------------------------------------
      //  process of default courses
      //  --------------------------------------------------
      let grade: number | null = null;
      let period: string | null = null;

      for (const row of block) {
        const value = normalize(row[classCode]);

        if (!value) continue;

        if (isGrade(value)) {
          grade = Number(Number(value).toFixed(1));
        } else if (isPeriod(value)) {
          period = value;
        }
      }

      if (grade !== null || period !== null) {
        if (period) {
          uniquePeriods.add(period);
        }

        studentGrades.push({
          studentId: studentId,
          materiaKey: classCode,
          grade,
          period,
          value: null,
          as: "default",
        });
      }
    }

  //  --------------------------------------------------
  //  process of REGIONALES
  //  --------------------------------------------------
    const regionalGrades = extractRegionals(
      studentId,
      block.map((r) => normalize(r[REGIONALES_COLUMN])),
    );

    regionalGrades.forEach((regionalGrade) => {
      if (regionalGrade.period) {
        uniquePeriods.add(regionalGrade.period);
      }
    });

    studentGrades.push(...regionalGrades);

    const currentSemester = uniquePeriods.size;
    const currentSemesterWithoutSummer = [...uniquePeriods].filter(
      (period) => period.slice(-2) !== "40",
    ).length;

    students.push({
      id: studentId,
      name: normalize(firstRow.Nombre) ?? NULL_DATA_STRING,
      status: normalize(firstRow.Estatus) ?? NULL_DATA_STRING,
      enrolledPeriod: normalize(firstRow.Periodo) ?? NULL_DATA_STRING,
      currentSemester,
      currentSemesterWithoutSummer,
    });

    grades.push(...studentGrades);
  }

    console.log(students);
    console.log(grades);

  return {
    students,
    grades,
  };
}
