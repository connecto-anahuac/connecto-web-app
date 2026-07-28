import type { DataViewConfig } from "@/components/table/dataView.types";
import type { StudentClassItem } from "./studentGrade.type";
import { generateAccentCombinations } from "@/shared/lib/util";

const STATUS_OPTIONS = [
  { label: "Reprobado", value: "failed" },
  { label: "Aprobado", value: "passed" },
  { label: "Cruzado", value: "isTaking" },
  { label: "Posibles", value: "enrollable" },
  { label: "Bloqueado por prerrequisitos", value: "lockedByPreRequisites" },
  { label: "Bloqueado por otros razones", value: "lockedByOthers" },
] as const;

const displayNumber = (value: number | null) =>
  value === null || Number.isNaN(value) ? "--" : String(value);

export const STUDENT_GRADE_VIEW_CONFIG: DataViewConfig<StudentClassItem> = {
  columns: [
    {
      id: "keyCode",
      label: "Clave",
      icon: "hashmark",
      valueType: "text",
      accessor: (item) => item.keyCode + item.keyNumber,
      format: (item) => item.keyCode + item.keyNumber || "--",
      searchTexts: (item) => [
        item.keyCode,
        item.keyNumber,
        item.keyCode + item.keyNumber,
        item.keyCode + " " + item.keyNumber,
      ],
    },
    {
      id: "name",
      label: "Nombre de materia",
      icon: "class",
      valueType: "text",
      accessor: (item) => item.name,
      format: (item) => item.name,
      initialSize: 240,
      searchTexts: (item) => generateAccentCombinations(item.name),
    },
    {
      id: "hours",
      label: "Horas",
      icon: "schedule",
      valueType: "number",
      accessor: (item) => item.hours,
      format: (item) => displayNumber(item.hours),
    },
    {
      id: "credits",
      label: "Créditos",
      icon: "schoolHat",
      valueType: "number",
      accessor: (item) => item.credits,
      format: (item) => displayNumber(item.credits),
    },
    // {
    //   id: "block",
    //   label: "Bloque",
    //   icon: "threeColumns",
    //   valueType: "text",
    //   accessor: (item) => item.block,
    //   format: (item) => item.block || "--",
    // },
    {
      id: "preRequisites",
      label: "Prerequisitos",
      icon: "class",
      valueType: "text",
      //TODO 複数値の検索、フィルタリングの実装
      accessor: (item) =>
        item.preRequisites.map((course) => course.name).join(", "),
      format: (item) =>
        item.preRequisites.length
          ? item.preRequisites.map((course) => course.name).join(", ")
          : "--",
      initialSize: 260,
      searchTexts: (item) =>
        item.preRequisites
          .map((course) => generateAccentCombinations(course.name))
          .flat(),
    },
    {
      id: "period",
      label: "Periodo de inscripción",
      icon: "schedule",
      valueType: "text",
      accessor: (item) => item.period?.raw ?? null,
      format: (item) => item.period?.label ?? "",
      searchTexts: (item) =>
        item.period ? [item.period.label, String(item.period.raw)] : [],
    },
    {
      id: "grade",
      label: "Calificación",
      icon: "schoolHat",
      valueType: "number",
      accessor: (item) => item.grade,
      format: (item) => displayNumber(item.grade),
    },
    {
      id: "semester",
      label: "Semestre",
      icon: "schedule",
      valueType: "number",
      accessor: (item) => item.semester,
      format: (item) => displayNumber(item.semester),
    },
    {
      id: "status",
      label: "Estado",
      icon: "status",
      valueType: "enum",
      accessor: (item) => item.status,
      format: (item) =>
        STATUS_OPTIONS.find((option) => option.value === item.status)?.label ??
        item.status,
      options: STATUS_OPTIONS,
      searchTexts: (item) => {
        const statusOption = STATUS_OPTIONS.find(
          (option) => option.value === item.status,
        );
        return statusOption ? generateAccentCombinations(statusOption.label.toLocaleLowerCase()): [];
      },
      initialSize: 220,
    },
  ],
};

// function generateAccentCombinations(text: string): string[] {
//   const normalized = text
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .normalize("NFC");

//   return [...new Set([text, normalized])];
// }
