import type { StudentListItem } from "@/features/students/types/student-list-item";
import { defineFilterField, type FilterField } from "./filter-field";

/**
 * Student フィルターの field key。
 * StudentListItem のプロパティ名と一致させ、getValue / store の fieldKey と揃える。
 */
export const STUDENT_FILTER_KEYS = {
  name: "name",
  status: "status",
  semester: "semester",
  career: "career",
  plan: "plan",
  reprobado: "reprobado",
} as const;

export type StudentFilterKey =
  (typeof STUDENT_FILTER_KEYS)[keyof typeof STUDENT_FILTER_KEYS];

/**
 * 確定している選択肢（static constants）の例。
 * career は現状固定値のため static に持たせる（hybrid の「確定」側）。
 */
//TODO 学部追加
export const STUDENT_CAREER_OPTIONS = [{ label: "TIND", value: "TIND" },
    { label: "Civil", value: "Civil" },
    { label: "Ambiental", value: "Ambiental" },{ label: "Industrial", value: "Industrial" }
] as const;

/**
 * Student（UI 表示用の joined view model）向けのフィルター定義。
 *
 * - 名前などは自由入力（free）
 * - 限られた選択肢は option
 *   - 実行時に値が確定するもの（status / semester / plan）は dynamicOptions で dataset から導出
 *   - 確定しているもの（career）は static options
 */
export const STUDENT_FILTER_FIELDS: FilterField<StudentListItem>[] = [
  defineFilterField<StudentListItem>({
    key: STUDENT_FILTER_KEYS.name,
    label: "Nombre",
    valueType: "text",
    inputType: "free",
    getValue: (student) => student.name,
  }),
  defineFilterField<StudentListItem>({
    key: STUDENT_FILTER_KEYS.status,
    label: "Estatus",
    valueType: "multiSelect",
    inputType: "option",
    dynamicOptions: true,
    getValue: (student) => student.status,
  }),
  defineFilterField<StudentListItem>({
    key: STUDENT_FILTER_KEYS.semester,
    label: "Semestre",
    valueType: "multiSelect", //TODO number
    inputType: "option",
    dynamicOptions: true,
    getValue: (student) => student.semester,
  }),
  defineFilterField<StudentListItem>({
    key: STUDENT_FILTER_KEYS.career,
    label: "Carrera",
    valueType: "multiSelect",
    inputType: "option",
    options: [...STUDENT_CAREER_OPTIONS],
    getValue: (student) => student.career,
  }),
  defineFilterField<StudentListItem>({
    key: STUDENT_FILTER_KEYS.plan,
    label: "Plan",
    valueType: "multiSelect",
    inputType: "option",
    dynamicOptions: true,
    getValue: (student) => student.plan,
  }),
  defineFilterField<StudentListItem>({
    key: STUDENT_FILTER_KEYS.reprobado,
    label: "Reprobado",
    valueType: "number",
    inputType: "free",
    getValue: (student) => student.reprobado,
  }),
];
