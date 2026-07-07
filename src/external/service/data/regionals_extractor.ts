import { GradeEntity } from "@/external/domain/university";
import { isGrade, isPeriod } from "@/external/service/data/shared";


export function extractRegionals(
  studentId: string ,
  values: (string | null)[],
): GradeEntity[] {
  const grades: GradeEntity[] = [];

  const regionalValues = values.filter(
    Boolean,
  ) as string[];

  let idx = 0;

  while (idx < regionalValues.length) {
    const current = regionalValues[idx];

    if (/^[A-Z]+\d+$/.test(current)) {
      const classCode = current;

      let grade: number | null = null;
      let period: string | null = null;

      if (
        idx + 1 < regionalValues.length &&
        isGrade(regionalValues[idx + 1])
      ) {
        grade = Number(
          regionalValues[idx + 1],
        );

        idx++;
      }

      if (idx + 1 < regionalValues.length) {
        const nextValue =
          regionalValues[idx + 1];

        if (isPeriod(nextValue)) {
          period = nextValue;

          idx++;
        } else {
          const parts =
            nextValue.split(" ");

          if (
            parts.length === 2 &&
            isPeriod(parts[0])
          ) {
            period = parts[0];

            regionalValues.splice(
              idx + 2,
              0,
              parts[1],
            );

            idx++;
          }
        }
      }

      grades.push({
        studentId: studentId,
        courseKey: classCode,
        grade,
        period,
        value:null,
        as: "REGIONALES",
      });
    }

    idx++;
  }

  return grades;
}