import {
  META_COLUMNS,
  EXCEPT_COLUMNS,
  REGIONALES_COLUMN,
  TINT_PATTERN,
} from "@/external/service/data/const";

import { isGrade, isPeriod } from "@/external/service/data/shared";

import { extractRegionals } from "./regionals_extractor";
import { GradeRecord, StudentRecord } from "@/external/domain/university";
import { NULL_DATA_STRING } from "@/shared/types/consts";
import { randomNumber } from "@/shared/lib/util";
import { splitPeriod } from "@/shared/lib/tool";
import { passGrade } from "@/external/domain/offering-course";

export async function processStudentCsv(
  rows: Record<string, string>[],
  career: string,
): Promise<{ students: StudentRecord[]; grades: GradeRecord[] }> {
  const students: StudentRecord[] = [];
  const grades: GradeRecord[] = [];

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
      console.warn(
        `Skipping student block at index ${start} due to missing ID`,
      );
      continue;
    }

    const studentGrades: GradeRecord[] = [];
    const uniquePeriods = new Set<string>();

    //  --------------------------------------------------
    //  process of normal Courses
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
          courseKey: classCode,
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
          courseKey: classCode,
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

    const failCount = studentGrades.filter((grade) => grade.grade !== null && grade.grade < passGrade).length;

    students.push({
      id: studentId,
      name: normalize(firstRow.Nombre) ?? NULL_DATA_STRING,
      status: normalize(firstRow.Estatus) ?? NULL_DATA_STRING,
      career,
      enrolledPeriod: normalize(firstRow.Periodo) ?? NULL_DATA_STRING,
      currentSemester: getCurrentSemester(normalize(firstRow.Periodo) ?? NULL_DATA_STRING),
      regularSemestersCount: currentSemester,
      summerSemestersCount: currentSemesterWithoutSummer,
      avatarColorRef: randomNumber(),
      failCount: failCount,
    });


    grades.push(...studentGrades);
  }

  // console.log(students);
  // console.log(grades);
  students.forEach((student) => { 
    console.log(`period: ${student.enrolledPeriod}, Current Semester: ${student.currentSemester}, Regular Semesters: ${student.regularSemestersCount}`);
  })

  return {
    students,
    grades,
  };
}

function normalize(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const text = String(value).trim();

  return text === "" ? null : text;
}

function getCurrentSemester(periods: string): number {
  const PERIOD_2_MONTH = 8;

  // when the students entered in summer, they are considered to be in the August-December semester of the same year
  const { year, semesterNumber } = splitPeriod(periods);
  // const enrolledSemester = semesterNumber === 10 ? 1 : 2; //semesterNumber === 40 ? 2 : semesterNumber === 60 ? 2 : 2;
  let enrolledYear = year;
  if (semesterNumber === 10) {
    enrolledYear -= 1;
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Months are zero-based
  const thisYearSemester = currentMonth < PERIOD_2_MONTH ? 1 : 2;
  const yearDiff = currentYear - enrolledYear;
  return 2 * (yearDiff - 1) + 1 + thisYearSemester;
}
