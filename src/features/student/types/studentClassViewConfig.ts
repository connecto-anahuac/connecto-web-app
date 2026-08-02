import type { DataViewConfig } from "@/shared/types/dataView.types";
import type { StudentGradeItem } from "./studentGrade.type";
import { generateAccentCombinations } from "@/shared/lib/util";

const STATUS_OPTIONS = [
  { label: "Reprobado", value: "failed" },
  { label: "Aprobado", value: "passed" },
  { label: "Cruzado", value: "isTaking" },
  { label: "Posibles", value: "enrollable" },
  { label: "Bloqueado por prerrequisitos", value: "lockedByPreRequisites" },
  { label: "Bloqueado por otros razones", value: "lockedByOthers" },
] as const;


export const STATUS_PRESETS = [
  { label: "Reprobado", columnId: "status", value: ["failed"] },
  { label: "Aprobado", columnId: "status", value: ["passed"] },
  { label: "Cruzado", columnId: "status", value: ["isTaking"] },
  { label: "Posibles", columnId: "status", value: ["enrollable"] },
  {
    label: "Bloqueado",
    columnId: "status",
    value: ["lockedByPreRequisites", "lockedByOthers"],
  },
] as const;

const displayNumber = (value: number | null) =>
  value === null || Number.isNaN(value) ? "--" : String(value);


export const STUDENT_GRADE_VIEW_CONFIG: DataViewConfig<StudentGradeItem> = {
  fields: [
    {
      fieldId: "keyCode",
      label: "Clave",
      icon: "hashmark",
      valueType: "enum",
      dynamicOption: true,
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
      fieldId: "name",
      label: "Nombre de materia",
      icon: "class",
      valueType: "text",
      accessor: (item) => item.name,
      format: (item) => item.name,
      searchTexts: (item) => generateAccentCombinations(item.name),
    },
    {
      fieldId: "hours",
      label: "Horas",
      icon: "schedule",
      valueType: "number",
      accessor: (item) => item.hours,
      format: (item) => displayNumber(item.hours),
    },
    {
      fieldId: "credits",
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
      fieldId: "preRequisites",
      label: "Prerequisitos",
      icon: "class",
      valueType: "text",
      //TODO 複数値の検索、フィルタリングの実装
      accessor: (item) =>
        item.preRequisites.map((course) => course.name).join(", "),
      format: (item) =>
        item.preRequisites.length
          ? item.preRequisites.map((course) => course.name).join(", ")
          : "",
      searchTexts: (item) =>
        item.preRequisites
          .map((course) => generateAccentCombinations(course.name))
          .flat(),
    },
    {
      fieldId: "period",
      label: "Periodo de inscripción",
      icon: "schedule",
      valueType: "enum",
      dynamicOption: true,
      accessor: (item) => item.period?.raw ?? null,
      format: (item) => item.period?.label ?? "",
      searchTexts: (item) =>
        item.period ? [item.period.label, String(item.period.raw)] : [],
    },
    {
      fieldId: "grade",
      label: "Calificación",
      icon: "schoolHat",
      valueType: "number",
      accessor: (item) => item.grade,
      format: (item) => displayNumber(item.grade),
    },
    {
      fieldId: "semester",
      label: "Semestre",
      icon: "schedule",
      valueType: "number",
      accessor: (item) => item.semester,
      format: (item) => displayNumber(item.semester),
    },
    {
      fieldId: "status",
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
        return statusOption
          ? generateAccentCombinations(
              statusOption.label.toLocaleLowerCase(),
            )
          : [item.status.toLocaleLowerCase()];
      },
    },
  ],
};
