import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Table } from "@tanstack/react-table";
import { describe, expect, it, vi } from "vitest";
import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import {
  getEnabledStudentTotal,
  ScheduleBuilderPresenter,
} from "./ScheduleBuilderPresenter";

const { dataSectionSpy, offeringClassCardSpy } = vi.hoisted(() => ({
  dataSectionSpy: vi.fn(),
  offeringClassCardSpy: vi.fn(),
}));

vi.mock("@/shared/component/composite/datasection/DataSection", () => ({
  default: (props: unknown) => {
    dataSectionSpy(props);
    return null;
  },
}));

vi.mock("@/features/offeringCourse/components/OfferingClassCardView", () => ({
  default: (props: unknown) => {
    offeringClassCardSpy(props);
    return null;
  },
}));

describe("getEnabledStudentTotal", () => {
  it("deduplicates students within each study plan only", () => {
    expect(
      getEnabledStudentTotal({
        planA: ["student-1", "student-1", "student-2"],
        planB: ["student-1", "student-3"],
      }),
    ).toBe(4);
  });
});

describe("ScheduleBuilderPresenter", () => {
  it("uses DataSection with a table list and the diagram as the default card view", () => {
    dataSectionSpy.mockClear();
    const course = offeringCourse();

    renderToStaticMarkup(
      createElement(ScheduleBuilderPresenter, {
        career: "TIND",
        config: { fields: [] },
        metadata: { optionsByFieldId: {} },
        error: null,
        filterResult: { matches: new Map([[course.key, { matched: true }]]) },
        loading: false,
        onSearchTextChange: () => undefined,
        offeringCourses: [course],
        pendingCourseKeys: [],
        drafts: {},
        searchText: "",
        selectedCourseKeys: [],
        table: {} as Table<OfferingCourse>,
        onOffer: () => undefined,
        onOpen: () => undefined,
        onUnoffer: () => undefined,
        onSessionCountChange: () => undefined,
        onClosePanel: () => undefined,
        panelContent: createElement("div", null, "Offering course panel"),
        selectedCourseKey: null,
      }),
    );

    const props = dataSectionSpy.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(props).toMatchObject({
      defaultView: "card",
      tableConfig: { fields: [] },
      searchText: "",
    });
    expect(props.table).toBeDefined();
    expect(props.listDiagram).toBeDefined();
    expect(props.cardDiagram).toBeDefined();
  });

  it("renders the offering course panel only when a course is selected", () => {
    const baseProps = {
      career: "TIND",
      config: { fields: [] },
      metadata: { optionsByFieldId: {} },
      error: null,
      filterResult: { matches: new Map() },
      loading: false,
      onSearchTextChange: () => undefined,
      offeringCourses: [offeringCourse()],
      pendingCourseKeys: [],
      drafts: {},
      searchText: "",
      selectedCourseKeys: [],
      table: {} as Table<OfferingCourse>,
      onOffer: () => undefined,
      onOpen: () => undefined,
      onClosePanel: () => undefined,
      onUnoffer: () => undefined,
      onSessionCountChange: () => undefined,
      panelContent: createElement("div", null, "Offering course panel"),
    };

    const openMarkup = renderToStaticMarkup(
      createElement(ScheduleBuilderPresenter, {
        ...baseProps,
        selectedCourseKey: "TIND-101",
      }),
    );
    const closedMarkup = renderToStaticMarkup(
      createElement(ScheduleBuilderPresenter, {
        ...baseProps,
        selectedCourseKey: null,
      }),
    );

    expect(openMarkup).toContain('aria-label="Oferta de asignatura"');
    expect(openMarkup).toContain("Offering course panel");
    expect(closedMarkup).not.toContain('aria-label="Oferta de asignatura"');
    expect(closedMarkup).not.toContain("Offering course panel");
  });

  it("wires panel activity separately from offered state on each card", () => {
    dataSectionSpy.mockClear();
    offeringClassCardSpy.mockClear();
    const activeCourse = offeringCourse();
    const offeredCourse = { ...offeringCourse(), key: "TIND-102", keyNumber: "102" };

    renderToStaticMarkup(
      createElement(ScheduleBuilderPresenter, {
        career: "TIND",
        config: { fields: [] },
        metadata: { optionsByFieldId: {} },
        error: null,
        filterResult: {
          matches: new Map([
            [activeCourse.key, { matched: true }],
            [offeredCourse.key, { matched: true }],
          ]),
        },
        loading: false,
        onSearchTextChange: () => undefined,
        offeringCourses: [activeCourse, offeredCourse],
        pendingCourseKeys: [],
        drafts: {},
        searchText: "",
        selectedCourseKeys: [offeredCourse.key],
        table: {} as Table<OfferingCourse>,
        onOffer: () => undefined,
        onOpen: () => undefined,
        onClosePanel: () => undefined,
        onUnoffer: () => undefined,
        onSessionCountChange: () => undefined,
        panelContent: createElement("div"),
        selectedCourseKey: activeCourse.key,
      }),
    );

    const dataSectionProps = dataSectionSpy.mock.calls[0]?.[0] as {
      cardDiagram: (hiddenItemIds: ReadonlySet<string>) => ReactElement;
    };
    renderToStaticMarkup(dataSectionProps.cardDiagram(new Set()));

    expect(offeringClassCardSpy).toHaveBeenCalledTimes(2);
    expect(offeringClassCardSpy.mock.calls[0]?.[0]).toMatchObject({
      isActive: true,
      isOffered: false,
    });
    expect(offeringClassCardSpy.mock.calls[1]?.[0]).toMatchObject({
      isActive: false,
      isOffered: true,
    });
  });

  it("hides diagram semesters and positions independently from the list", () => {
    dataSectionSpy.mockClear();
    offeringClassCardSpy.mockClear();
    const firstCourse = offeringCourse();
    const secondCourse = {
      ...offeringCourse(),
      key: "TIND-202",
      keyNumber: "202",
      semester: 2,
      position: 2,
    };

    renderToStaticMarkup(
      createElement(ScheduleBuilderPresenter, {
        career: "TIND",
        config: { fields: [] },
        metadata: { optionsByFieldId: {} },
        error: null,
        filterResult: {
          matches: new Map([
            [firstCourse.key, { matched: true }],
            [secondCourse.key, { matched: true }],
          ]),
        },
        loading: false,
        onSearchTextChange: () => undefined,
        offeringCourses: [firstCourse, secondCourse],
        pendingCourseKeys: [],
        drafts: {},
        searchText: "",
        selectedCourseKeys: [],
        table: {} as Table<OfferingCourse>,
        onOffer: () => undefined,
        onOpen: () => undefined,
        onClosePanel: () => undefined,
        onUnoffer: () => undefined,
        onSessionCountChange: () => undefined,
        panelContent: createElement("div"),
        selectedCourseKey: null,
      }),
    );

    const props = dataSectionSpy.mock.calls[0]?.[0] as {
      cardDiagram: (hiddenItemIds: ReadonlySet<string>) => ReactElement;
      cardHideItems: { id: string; label: string }[];
      listDiagram: ReactElement;
    };
    expect(props.cardHideItems).toEqual(
      expect.arrayContaining([
        { id: "semester:2", label: "Semestre 2" },
        { id: "position:2", label: "Fila C" },
      ]),
    );
    expect(props.listDiagram).toBeDefined();

    renderToStaticMarkup(props.cardDiagram(new Set(["semester:2"])));
    expect(offeringClassCardSpy).toHaveBeenCalledTimes(1);
    expect(offeringClassCardSpy.mock.calls[0]?.[0]).toMatchObject({
      offeringClass: firstCourse,
    });
  });
});

function offeringCourse(): OfferingCourse {
  return {
    key: "TIND-101",
    keyCode: "TIND",
    keyNumber: "101",
    hours: 4,
    credits: 8,
    block: "Base",
    name: "Programming",
    semester: 1,
    position: 1,
    preRequisites: [],
    estimatedNumber: 12,
  };
}
