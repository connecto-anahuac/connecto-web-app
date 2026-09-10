import type { Informations } from "@/shared/component/composite/profileSummary/summary/ProfileSummary";
import type { ProfileDataCardProps } from "@/shared/component/composite/profileSummary/card/ProfileDataCard";
import {
  GRADE_NOT_FOUND_VALUE,
  PASS_GRADE,
  type AlertLevel,
} from "@/shared/types/consts";
import type { StudentGradeItem } from "@/features/student/types/studentGrade.type";
import type { StudentDetail } from "../../ui/studentSummaryPanel/studentSummary.type";

export type StudentDetailOverviewCards = {
  topLeftInformations: ProfileDataCardProps[];
  warningInformations: ProfileDataCardProps;
  requirementInformations: ProfileDataCardProps;
  failedClassInformations: ProfileDataCardProps;
};

export function buildProfileInformations(student: StudentDetail): Informations {
  return {
    id: { iconName: "hashmark", label: "Matricula", value: student.profile.id },
    name: { iconName: "person", label: "Nombre", value: student.profile.name },
    career: { iconName: "frascoOutline", label: "Carrera", value: student.career },
    semester: {
      iconName: "schedule",
      label: "Semestre",
      value: String(student.profile.currentSemester),
    },
    enrolledPeriod: {
      iconName: "schedule",
      label: "Periodo ingresado",
      value: student.profile.enrolledPeriod,
    },
    nationality: { iconName: "twoPersons", label: "Nacionalidad", value: "Mexicana" },
    schoolMail: {
      iconName: "schoolEmail",
      label: "Correo escolar",
      value: student.contact.schoolEmail,
    },
    personalMail: {
      iconName: "email",
      label: "Correo personal",
      value: student.contact.privateEmail,
    },
    phone: { iconName: "whatsapp", label: "Celular", value: student.contact.phone },
  };
}

export function buildGradeAverageInformation(
  grades: readonly StudentGradeItem[],
): ProfileDataCardProps {
  const gradedCourses = grades.filter(
    (item): item is StudentGradeItem & { grade: number } =>
      typeof item.grade === "number" &&
      Number.isFinite(item.grade) &&
      item.grade !== GRADE_NOT_FOUND_VALUE,
  );
  const latestSemester = Math.max(...gradedCourses.map((item) => item.semester));
  const latestSemesterGrades = gradedCourses.filter(
    (item) => item.semester === latestSemester,
  );

  return {
    valueType: "multi",
    iconName: "schoolHat",
    title: "Promedio",
    value: [
      { label: "Global", value: formatAverage(gradedCourses) },
      {
        label: Number.isFinite(latestSemester)
          ? `Semestre ${latestSemester}`
          : "Último semestre",
        value: formatAverage(latestSemesterGrades),
      },
    ],
  };
}

export function buildStudentDetailOverviewCards(
  student: StudentDetail,
  grades: readonly StudentGradeItem[],
  totalSemesters: number,
): StudentDetailOverviewCards {
  const progressDifference = student.advance - student.idealAdvance;
  const lockedCourses = grades.filter(
    (grade) => grade.status === "lockedByPreRequisites",
  ).length;
  const warnings = [
    ...(student.failedCoursesCount > 0
      ? [{ text: `${student.failedCoursesCount} materias reprobadas.` }]
      : []),
    ...(lockedCourses > 0
      ? [{ text: `${lockedCourses} materias bloqueadas por prerrequisitos.` }]
      : []),
  ];
  const requirementLabel = parseRequirementLabel(student.requirementLabel);
  const cs = student.profile.currentSemester;
  let currentSemesterPrefix = "";
  switch (cs) {
    case 1:
    case 3:
    case 11:
    case 13:
      currentSemesterPrefix = "ro";
      break;
    case 2:
      currentSemesterPrefix = "do";
      break;
    case 4:
    case 5:
    case 6:
    case 14:
    case 15:
    case 16:
    case 17:
      currentSemesterPrefix = "to";
      break;
    case 7:
    case 10:
    case 20:
      currentSemesterPrefix = "mo";
      break;
    case 8:
    case 12:
    case 18:
      currentSemesterPrefix = "vo";
      break;
    case 9:
    case 19:
      currentSemesterPrefix = "no";
      break;
    
  }
  
  const currentSemester = cs + currentSemesterPrefix;

  return {
    topLeftInformations: [
      buildGradeAverageInformation(grades),
      {
        valueType: "multi",
        iconName: "schedule",
        title: "Semestres llevados",
        value: [
          { label: "Actual", value: currentSemester },
          { label: "Regular", value: String(student.profile.regularSemestersCount) },
          {
            label: "Verano",
            value:"--"
            //   String(
            //   Math.max(0, totalSemesters - student.profile.regularSemestersCount),
            // ),
          },
        ],
      },
      {
        valueType: "count",
        iconName: "failedClass",
        title: "Número de reprobados",
        value: {
          current: student.failedCoursesCount,
          total: grades.length,
          status: getFailedCoursesAlertLevel(student.failedCoursesCount),
        },
      },
      {
        valueType: "percent",
        iconName: "status",
        title: "Avance",
        value: {
          value: String(student.advance),
          diff: formatSignedPercentage(progressDifference),
          status: progressDifference < 0 ? "high" : "low",
        },
      },
      {
        valueType: "count",
        iconName: "curriculum",
        title: "Requisitos de graduación",
        value: {
          current: requirementLabel.current,
          total: requirementLabel.total,
          status:
            requirementLabel.current === requirementLabel.total ? "low" : "medium",
        },
      },
    ],
    warningInformations: {
      valueType: "warning",
      iconName: "bell",
      title: "Advertencias",
      value:
        warnings.length > 0
          ? warnings
          : [{ text: "Sin advertencias académicas." }],
    },
    requirementInformations: {
      valueType: "requirement",
      iconName: "curriculum",
      title: "Requisitos de graduación",
      value: Object.entries(student.requirements ?? {}).map(([text, isCompleted]) => ({
        text,
        isCompleted,
      })),
    },
    failedClassInformations: buildFailedClassInformation(grades),
  };
}

function buildFailedClassInformation(
  grades: readonly StudentGradeItem[],
): ProfileDataCardProps {
  const failedCourses = grades.filter(
    (item) =>
      item.grade !== null &&
      item.grade !== GRADE_NOT_FOUND_VALUE &&
      item.grade < PASS_GRADE,
  );

  return {
    valueType: "class",
    iconName: "class",
    title: "Materias reprobadas",
    value: failedCourses.map((item) => ({
      courseCode: item.keyCode,
      courseNumber: item.keyNumber,
      credits: item.credits.toString(),
      hours: item.hours.toString(),
      grade: item.grade,
      title: item.name,
      period: item.period,
      status: item.status,
    })),
  };
}

function formatAverage(
  grades: readonly (StudentGradeItem & { grade: number })[],
): string {
  if (grades.length === 0) return "--";
  return (
    grades.reduce((sum, item) => sum + item.grade, 0) / grades.length
  ).toFixed(2);
}

function getFailedCoursesAlertLevel(failedCoursesCount: number): AlertLevel {
  if (failedCoursesCount === 0) return "low";
  if (failedCoursesCount <= 2) return "medium";
  return "high";
}

function formatSignedPercentage(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function parseRequirementLabel(label: string): { current: number; total: number } {
  const match = /^(\d+)\s*\/\s*(\d+)$/.exec(label);
  return match
    ? { current: Number(match[1]), total: Number(match[2]) }
    : { current: 0, total: 0 };
}
