"use client";

import * as Tabs from "@radix-ui/react-tabs";

import ProfileSummary, {
  Informations,
} from "@/shared/component/composite/profileSummary/summary/ProfileSummary";
import type { StudentGradeItem } from "@/features/student/types/studentGrade.type";
import type { StudentDetail } from "../../ui/studentSummaryPanel/studentSummary.type";
import {
  GRADE_NOT_FOUND_VALUE,
  type AlertLevel,
  StudentStatus,
  PASS_GRADE,
} from "@/shared/types/consts";
import ProfileDataCard, {
  type ProfileDataCardProps,
} from "@/shared/component/composite/profileSummary/card/ProfileDataCard";
import TabBadge from "@/shared/component/primitive/TabBadge";
import { Icons } from "@/shared/component/primitive/icon";
import { StudentDetailContainer } from "./StudentDetailContainer";

export type StudentSinglePageTemplateProps = {
  studentId: string;
  infomations: Informations;
  imgSrc: string;
  status: StudentStatus;
  planTotalSemesters: number;
  topLeftInfomations: ProfileDataCardProps[];
  warningInfomations: ProfileDataCardProps;
  requirementInfomations: ProfileDataCardProps;
  failedClassInfomations: ProfileDataCardProps;
};

export function bildProfileInformationa(student: StudentDetail): Informations {
  return {
    id: { iconName: "hashmark", label: "Matricula", value: student.profile.id },
    name: { iconName: "person", label: "Nombre", value: student.profile.name },
    career: {
      iconName: "frascoOutline",
      label: "Carrera",
      value: student.career,
    },
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
    nationality: {
      iconName: "twoPersons",
      label: "Nacionalidad",
      value: "Mexicana",
    },
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
    phone: {
      iconName: "whatsapp",
      label: "Celular",
      value: student.contact.phone,
    },
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
  const latestSemester = Math.max(
    ...gradedCourses.map((item) => item.semester),
  );
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
        label: "Último", //Number.isFinite(latestSemester) ? `Semestre ${latestSemester}` : "Último semestre",
        value: formatAverage(latestSemesterGrades),
      },
    ],
  };
}

export function buildFailedClassInformation(
  grades: readonly StudentGradeItem[],
): ProfileDataCardProps {
  const failedCourses = grades.filter(
    (item) =>
      item.grade !== null &&
      GRADE_NOT_FOUND_VALUE !== item.grade &&
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

export type StudentDetailInformationCards = Pick<
  StudentSinglePageTemplateProps,
  | "topLeftInfomations"
  | "warningInfomations"
  | "requirementInfomations"
  | "failedClassInfomations"
>;

export function buildStudentDetailInformationCards(
  student: StudentDetail,
  grades: readonly StudentGradeItem[],
  totalSemesters: number,
): StudentDetailInformationCards {
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

  const requirements = student.requirements;

  return {
    topLeftInfomations: [
      buildGradeAverageInformation(grades),
      {
        valueType: "multi",
        iconName: "schedule",
        title: "Semestres llevados",
        value: [
          { label: "Total", value: String(totalSemesters) },
          {
            label: "Regular",
            value: String(student.profile.regularSemestersCount),
          },
          {
            label: "Verano",
            value: String(
              Math.max(
                0,
                totalSemesters - student.profile.regularSemestersCount,
              ),
            ),
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
            requirementLabel.current === requirementLabel.total
              ? "low"
              : "medium",
        },
      },
    ],
    // requirementInfomations: {
    //   valueType: "count",
    //   iconName: "curriculum",
    //   title: "Requisitos de graduación",
    //   value: {
    //     current: requirements.current,
    //     total: requirements.total,
    //     status: requirements.current === requirements.total ? "low" : "medium",
    //   },
    // },
    warningInfomations: {
      valueType: "warning",
      iconName: "bell",
      title: "Advertencias",
      value:
        warnings.length > 0
          ? warnings
          : [{ text: "Sin advertencias académicas." }],
    },
    requirementInfomations: {
      valueType: "requirement",
      iconName: "curriculum",
      title: "Requisitos de graduación",
      value: requirements
        ? Object.entries(requirements).map(([key, value]) => ({
            text: key,
            isCompleted: value,
          }))
        : [],
    },
    failedClassInfomations: buildFailedClassInformation(grades),
  };
}

export default function StudentGeneralPage({
  infomations,
  imgSrc,
  status,
  planTotalSemesters,
  topLeftInfomations,
  warningInfomations,
  requirementInfomations,
  failedClassInfomations,
  studentId,
}: StudentSinglePageTemplateProps) {
  return (
    <div className="flex gap-3 w-full h-full ">
      <ProfileSummary
        className="w-70"
        infomations={infomations}
        imgSrc={imgSrc}
        status={status}
        planTotalSemesters={planTotalSemesters}
      />

      <Tabs.Root
        defaultValue="overview"
        className="flex-1 h-full flex flex-col"
      >
        <div className="w-full flex flex-col gap-1">
          <Tabs.List className="flex gap-2">
            <Tabs.Trigger value="overview">
              <TabBadge
                label={"Generales"}
                icon={<Icons.list />}
                selected={true}
              />
            </Tabs.Trigger>
            <Tabs.Trigger value="curriculum">
              <TabBadge
                label={"Plan de estudios"}
                icon={<Icons.curriculum />}
                selected={false}
              />
            </Tabs.Trigger>
          </Tabs.List><div className="w-full h-px bg-DividerMiddle" />
        </div>

        <Tabs.Content value="overview" className="w-full h-full">
          <div className="overflow-y-scroll w-full h-full">
            <div className="mt-4 grid w-full min-w-110 self-start grid-cols-4 gap-4">
              {topLeftInfomations.map((props) => (
                <ProfileDataCard
                  key={props.title}
                  className="h-fit col-span-1"
                  {...props}
                />
              ))}
              <ProfileDataCard
                className="col-span-2 row-span-3 col-start-3 row-start-1 h-full"
                {...warningInfomations}
              />
              <ProfileDataCard
                className="h-fit col-span-2 col-start-3 row-start-4"
                {...requirementInfomations}
              />
              <ProfileDataCard
                className="h-fit col-span-2 col-start-1 row-start-4"
                {...failedClassInfomations}
              />
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="curriculum"  className="w-full h-full">
          <DiagramContainer studentId={studentId} />
        </Tabs.Content>
      </Tabs.Root>

      {/* <div className="flex-1 h-full flex flex-col">
        <div className="flex flex-col w-full">
          <div className="flex gap-2">
            <TabBadge
              label={"Generales"}
              icon={<Icons.list />}
              selected={true}
            />
            <TabBadge
              label={"Plan de estudios"}
              icon={<Icons.curriculum />}
              selected={false}
            />
          </div>
          <div className="w-full h-px bg-DividerMiddle" />
        </div>
        <div className="overflow-y-scroll w-full h-full">
          <div className="mt-4 grid w-full min-w-110 self-start grid-cols-4 gap-4">
            {topLeftInfomations.map((props) => (
              <ProfileDataCard
                key={props.title}
                className="h-fit col-span-1"
                {...props}
              />
            ))}
            <ProfileDataCard
              className="col-span-2 row-span-3 col-start-3 row-start-1 h-full"
              {...warningInfomations}
            />
            <ProfileDataCard
              className="h-fit col-span-2 col-start-3 row-start-4"
              {...requirementInfomations}
            />
            <ProfileDataCard
              className="h-fit col-span-2 col-start-1 row-start-4"
              {...failedClassInfomations}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}

function formatAverage(
  grades: readonly (StudentGradeItem & { grade: number })[],
) {
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

function parseRequirementLabel(label: string): {
  current: number;
  total: number;
} {
  const match = /^(\d+)\s*\/\s*(\d+)$/.exec(label);
  return match
    ? { current: Number(match[1]), total: Number(match[2]) }
    : { current: 0, total: 0 };
}
