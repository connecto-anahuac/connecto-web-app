import type { DataViewConfig } from "@/shared/types/dataView.types";
import { generateAccentCombinations } from "@/shared/lib/util";
import { StudentCollectionItem } from "./studentCollection.type";
import { CARRERAS, StudentStatus } from "@/shared/types/consts";

const STATUS_OPTIONS = [
  { label: StudentStatus.ACTIVE, value: StudentStatus.ACTIVE },
  { label: StudentStatus.INACTIVE, value: StudentStatus.INACTIVE },
  { label: StudentStatus.BAJA_ACADEMICA, value: StudentStatus.BAJA_ACADEMICA },
  { label: StudentStatus.BAJA_VOLUNTARIA, value: StudentStatus.BAJA_VOLUNTARIA },
] as const;

const CAREER_OPTIONS =CARRERAS.map((career) => ({
  label: career,
  value: career,
})) ;
  



export const STUDENT_COLLECTION_PRESETS = [
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




export const STUDENT_COLLECTION_VIEW_CONFIG: DataViewConfig<StudentCollectionItem> = {
  fields: [
    {
      fieldId: "studentId",
      label: "Matricula",
      icon: "hashmark",
      valueType: "text",
      dynamicOption: false,
      accessor: (item) => Number(item.studentId),
      format: (item) => item.studentId || "unknown",
      
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
    {
      fieldId: "career",
      label: "Carrera",
      icon: "frascoOutline",
      valueType: "enum",
      accessor: (item) => item.career,
      format: (item) =>
        CAREER_OPTIONS.find((option) => option.value === item.career)?.label ??
        item.career,
      options: CAREER_OPTIONS,
      searchTexts: (item) => {
        const careerOption = CAREER_OPTIONS.find(
          (option) => option.value === item.career,
        );
        return careerOption
          ? generateAccentCombinations(
              careerOption.label.toLocaleLowerCase(),
            )
          : [item.career.toLocaleLowerCase()];
      },
    },
    {
      fieldId: "currentSemester",
      label: "Semestre",
      icon: "schedule",
      valueType: "number",
      accessor: (item) => item.currentSemester,
      format: (item) => displayNumber(item.currentSemester),
    },
    
    {
      fieldId: "enrolledPeriod",
      label: "Periodo de inscripción",
      icon: "schedule",
      valueType: "enum",
      dynamicOption: true,
      accessor: (item) => item.enrolledPeriod?.raw ?? null,
      format: (item) => item.enrolledPeriod?.label ?? "",
      searchTexts: (item) =>
        item.enrolledPeriod ? [item.enrolledPeriod.label, String(item.enrolledPeriod.raw)] : [],
    },
    {
      fieldId: "classProgress",
      label: "Avance",
      icon: "progress",
      valueType: "number",
      dynamicOption: false,
      accessor: (item) => Number(item.classProgress),
      format: (item) => item.classProgress.toString() ,
      
    },
    {
      fieldId: "failedClassCount",
      label: "Reprobadas",
      icon: "failedClass",
      valueType: "number",
      dynamicOption: false,
      accessor: (item) => Number(item.failedClassCount),
      format: (item) => item.failedClassCount.toString() ,
      
    },
  ],
};
