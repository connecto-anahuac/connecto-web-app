import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Table } from "@tanstack/react-table";
import { describe, expect, it, vi } from "vitest";
import { StudentStatus } from "@/shared/types/consts";
import type { StudentClassItem } from "@/features/student/types";
import type { StudentDetail } from "../../ui/studentSummaryPanel/studentSummary.type";
import { StudentDetailPresenter } from "./StudentDetailPresenter";
import type { StudentDetailTab } from "./useStudentDetailTabs";
import {
  buildGradeAverageInformation,
  buildProfileInformations,
  buildStudentDetailOverviewCards,
} from "./studentDetailViewModel";

vi.mock("@/shared/component/composite/datasection/DataSection", () => ({
  default: () => <div data-testid="curriculum-data-section" />,
}));

function grade(semester: number, value: number | null): StudentClassItem {
  return { semester, grade: value } as StudentClassItem;
}

describe("studentDetailViewModel", () => {
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

  it("returns placeholders and safe requirement values when grade data is absent", () => {
    const cards = buildStudentDetailOverviewCards(
      studentDetail({ requirementLabel: "unknown" }),
      [],
      0,
    );

    expect(buildGradeAverageInformation([grade(1, null), grade(2, -1)])).toMatchObject({
      value: [
        { label: "Global", value: "--" },
        { label: "Último semestre", value: "--" },
      ],
    });
    expect(cards.warningInformations).toMatchObject({
      value: [{ text: "Sin advertencias académicas." }],
    });
    expect(cards.topLeftInformations.at(-1)).toMatchObject({
      value: { current: 0, total: 0 },
    });
  });

  it("derives warnings, overview cards, and graduation requirements", () => {
    const cards = buildStudentDetailOverviewCards(
      studentDetail({
        failedCoursesCount: 3,
        advance: 60,
        idealAdvance: 70,
        requirementLabel: "1/3",
        requirements: { Servicio: true, Inglés: false },
      }),
      [grade(1, 8), { ...grade(2, null), status: "lockedByPreRequisites" }],
      5,
    );

    expect(cards.topLeftInformations).toMatchObject([
      { title: "Promedio" },
      { title: "Semestres llevados" },
      { title: "Número de reprobados", value: { current: 3, status: "high" } },
      { title: "Avance", value: { value: "60", diff: "-10", status: "high" } },
      { title: "Requisitos de graduación", value: { current: 1, total: 3 } },
    ]);
    expect(cards.warningInformations).toMatchObject({
      value: [
        { text: "3 materias reprobadas." },
        { text: "1 materias bloqueadas por prerrequisitos." },
      ],
    });
    expect(cards.requirementInformations).toMatchObject({
      value: [
        { text: "Servicio", isCompleted: true },
        { text: "Inglés", isCompleted: false },
      ],
    });
  });
});

describe("StudentDetailPresenter", () => {
  it("renders the profile summary, overview, and curriculum entry point", () => {
    const student = studentDetail();
    const cards = buildStudentDetailOverviewCards(student, [], 3);

    const markup = renderToStaticMarkup(
      createElement(StudentDetailPresenter, {
        profileInformations: buildProfileInformations(student),
        imgSrc: "/data/avatar.png",
        status: StudentStatus.ACTIVE,
        planTotalSemesters: 3,
        ...cards,
        studentGrades: [],
        table: {} as Table<StudentClassItem>,
        tableConfig: { fields: [] },
        searchText: "",
        onSearchTextChange: () => undefined,
        presets: [],
        filterResult: { matches: new Map() },
        metadata: { optionsByFieldId: {} },
        selectedTab: "overview" satisfies StudentDetailTab,
        onTabChange: () => undefined,
        className: "p-2",
      }),
    );

    expect(markup).toContain("Ada");
    expect(markup).toContain("Generales");
    expect(markup).toContain("Plan de estudios");
    expect(markup).toContain("p-2");
    expect(markup).toContain('data-state="inactive"');
    expect(markup).toContain("Requisitos de graduación");
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
      career: "TIND"
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
    requirements: {},
    contact: { schoolEmail: "", privateEmail: "", phone: "" },
    memo: "",
    ...overrides,
  };
}
