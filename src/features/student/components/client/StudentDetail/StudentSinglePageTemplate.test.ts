import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import StudentGeneralPage, {
  bildProfileInformationa,
  buildGradeAverageInformation,
  buildStudentDetailInformationCards,
} from "./StudentSinglePageTemplate";
import type { StudentGradeItem } from "@/features/student/types/studentGrade.type";
import type { StudentDetail } from "../../ui/studentSummaryPanel/studentSummary.type";
import { StudentStatus } from "@/shared/types/consts";

function grade(semester: number, value: number | null): StudentGradeItem {
  return { semester, grade: value } as StudentGradeItem;
}

describe("buildGradeAverageInformation", () => {
  it("calculates the cumulative and latest-semester averages from valid grades", () => {
    const summary = buildGradeAverageInformation([
      grade(1, 8),
      grade(1, 10),
      grade(2, 7),
      grade(2, 9),
      grade(3, null),
      grade(3, -1),
    ]);

    expect(summary).toMatchObject({
      valueType: "multi",
      title: "Promedio",
      value: [
        { label: "Global", value: "8.50" },
        { label: "Semestre 2", value: "8.00" },
      ],
    });
  });

  it("returns placeholders when no valid grades are available", () => {
    const summary = buildGradeAverageInformation([grade(1, null), grade(2, -1)]);

    expect(summary).toMatchObject({
      value: [
        { label: "Global", value: "--" },
        { label: "Último semestre", value: "--" },
      ],
    });
  });
});

describe("buildStudentDetailInformationCards", () => {
  it("derives summary, warning, and requirement cards from student data", () => {
    const cards = buildStudentDetailInformationCards(
      studentDetail({
        failedCoursesCount: 3,
        advance: 60,
        idealAdvance: 70,
        requirementLabel: "1/3",
      }),
      [grade(1, 8), { ...grade(2, null), status: "lockedByPreRequisites" }],
      5,
    );

    expect(cards.topLeftInfomations).toMatchObject([
      { title: "Promedio" },
      {
        title: "Semestres llevados",
        value: [
          { label: "Total", value: "5" },
          { label: "Regular", value: "3" },
          { label: "Verano", value: "2" },
        ],
      },
      { title: "Número de reprobados", value: { current: 3, status: "high" } },
      { title: "Avance", value: { value: "60", diff: "-10", status: "high" } },
    ]);
    expect(cards.warningInfomations).toMatchObject({
      value: [
        { text: "3 materias reprobadas." },
        { text: "1 materias bloqueadas por prerrequisitos." },
      ],
    });
    expect(cards.requirementInfomations).toMatchObject({
      value: { current: 1, total: 3, status: "medium" },
    });
  });

  it("shows the no-warning fallback and safe requirement values", () => {
    const cards = buildStudentDetailInformationCards(
      studentDetail({ requirementLabel: "unknown" }),
      [],
      0,
    );

    expect(cards.warningInfomations).toMatchObject({
      value: [{ text: "Sin advertencias académicas." }],
    });
    expect(cards.requirementInfomations).toMatchObject({
      value: { current: 0, total: 0 },
    });
  });
});

describe("StudentSinglePageTemplate", () => {
  it("renders a three-row grid with warnings spanning the right two columns", () => {
    const student = studentDetail();
    const cards = buildStudentDetailInformationCards(student, [], 3);

    const markup = renderToStaticMarkup(
      createElement(StudentGeneralPage, {
        infomations: bildProfileInformationa(student),
        imgSrc: "/data/avatar.png",
        status: StudentStatus.ACTIVE,
        planTotalSemesters: 3,
        ...cards,
      }),
    );

    expect(markup).toContain("grid flex-1 min-w-110 self-start grid-cols-4 gap-4");
    expect(markup).toContain("col-span-2 row-span-3 col-start-3 row-start-1 h-full");
    expect(markup).toContain("h-fit col-span-1 col-start-1 row-start-3");
    expect(markup).toContain("Requisitos de graduaci");
  });
});

function studentDetail(overrides: Partial<StudentDetail> = {}): StudentDetail {
  return {
    profile: {
      id: "1",
      name: "Ada",
      status: StudentStatus.ACTIVE,
      enrolledPeriod: "202460",
      enrolledYear: 2024,
      enrolledSemester: "ago-dec",
      currentSemester: 3,
      regularSemestersCount: 3,
      avatarColorRef: 0,
    },
    avatarColorCssVar: "",
    career: "TIND",
    plan: "Plan",
    advanceLabel: "0%",
    advance: 0,
    idealAdvance: 0,
    failedCoursesCount: 0,
    currentCoursesLabel: "0",
    requirementLabel: "0/0",
    contact: { schoolEmail: "", privateEmail: "", phone: "" },
    memo: "",
    ...overrides,
  };
}
