import type { FilterCondition } from "../../../../search/shared/filter-definition";
import { STUDENT_FILTER_KEYS } from "../../../../student/types/student-filter-fields";

const ALERTA_RANGE: [number, number] = [1, 2];
const ADVERTENCIA_THRESHOLD = 2;

export type StudentPresetKey = "career" | "status" | "alerta" | "advertencia";

function toArrayValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (value === null || value === undefined) {
    return [];
  }

  return [String(value)];
}

function isAdvertenciaCondition(condition: FilterCondition | undefined): boolean {
  return (
    condition?.fieldKey === STUDENT_FILTER_KEYS.failCount &&
    condition.operator === "gt" &&
    condition.value === ADVERTENCIA_THRESHOLD
  );
}

function isAlertaCondition(condition: FilterCondition | undefined): boolean {
  return (
    condition?.fieldKey === STUDENT_FILTER_KEYS.failCount &&
    condition.operator === "between" &&
    Array.isArray(condition.value) &&
    condition.value.length === 2 &&
    condition.value[0] === ALERTA_RANGE[0] &&
    condition.value[1] === ALERTA_RANGE[1]
  );
}

function togglePresetOption(
  condition: FilterCondition | undefined,
  targetValue: string,
): string[] {
  const currentValues = toArrayValue(condition?.value);

  return currentValues.includes(targetValue)
    ? currentValues.filter((value) => value !== targetValue)
    : [...currentValues, targetValue];
}

export function isStudentPresetSelected(
  presetKey: StudentPresetKey,
  conditions: FilterCondition[],
): boolean {
  const careerCondition = conditions.find(
    (condition) => condition.fieldKey === STUDENT_FILTER_KEYS.career,
  );
  const statusCondition = conditions.find(
    (condition) => condition.fieldKey === STUDENT_FILTER_KEYS.status,
  );
  const reprobadoCondition = conditions.find(
    (condition) => condition.fieldKey === STUDENT_FILTER_KEYS.failCount,
  );

  switch (presetKey) {
    case "career":
      return toArrayValue(careerCondition?.value).includes("TIND");
    case "status":
      return toArrayValue(statusCondition?.value).includes("activo");
    case "alerta":
      return isAlertaCondition(reprobadoCondition);
    case "advertencia":
      return isAdvertenciaCondition(reprobadoCondition);
  }
}

export function getStudentPresetNextConditions(
  conditions: FilterCondition[],
  presetKey: StudentPresetKey,
): FilterCondition[] {
  const careerCondition = conditions.find(
    (condition) => condition.fieldKey === STUDENT_FILTER_KEYS.career,
  );
  const statusCondition = conditions.find(
    (condition) => condition.fieldKey === STUDENT_FILTER_KEYS.status,
  );
  const reprobadoCondition = conditions.find(
    (condition) => condition.fieldKey === STUDENT_FILTER_KEYS.failCount,
  );

  if (presetKey === "career") {
    const nextValues = togglePresetOption(careerCondition, "TIND");
    const rest = conditions.filter(
      (condition) => condition.fieldKey !== STUDENT_FILTER_KEYS.career,
    );

    return nextValues.length === 0
      ? rest
      : [
          ...rest,
          {
            id: STUDENT_FILTER_KEYS.career,
            fieldKey: STUDENT_FILTER_KEYS.career,
            operator: "in",
            value: nextValues,
          },
        ];
  }

  if (presetKey === "status") {
    const nextValues = togglePresetOption(statusCondition, "activo");
    const rest = conditions.filter(
      (condition) => condition.fieldKey !== STUDENT_FILTER_KEYS.status,
    );

    return nextValues.length === 0
      ? rest
      : [
          ...rest,
          {
            id: STUDENT_FILTER_KEYS.status,
            fieldKey: STUDENT_FILTER_KEYS.status,
            operator: "in",
            value: nextValues,
          },
        ];
  }

  const rest = conditions.filter(
    (condition) => condition.fieldKey !== STUDENT_FILTER_KEYS.failCount,
  );

  if (presetKey === "alerta") {
    return isAlertaCondition(reprobadoCondition)
      ? rest
      : [
          ...rest,
          {
            id: STUDENT_FILTER_KEYS.failCount,
            fieldKey: STUDENT_FILTER_KEYS.failCount,
            operator: "between",
            value: ALERTA_RANGE,
          },
        ];
  }

  return isAdvertenciaCondition(reprobadoCondition)
    ? rest
    : [
        ...rest,
        {
          id: STUDENT_FILTER_KEYS.failCount,
          fieldKey: STUDENT_FILTER_KEYS.failCount,
          operator: "gt",
          value: ADVERTENCIA_THRESHOLD,
        },
      ];
}