import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Table } from "@tanstack/react-table";
import { describe, expect, it, vi } from "vitest";
import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import { OFFERING_COURSE_VIEW_CONFIG } from "@/features/offeringCourse/types/offering-course-filter-fields";
import { OfferingCourseShellPresenter } from "./OfferingCourseShellPresenter";

vi.mock("@/shared/component/composite/datasection/DataSection", () => ({
  default: ({
    defaultView,
    enableView,
    listDiagram,
    listTools,
    showZoom,
  }: {
    defaultView: string;
    enableView: string[];
    listDiagram: ReactNode;
    listTools: string[];
    showZoom: boolean;
  }) => (
    <div
      data-default-view={defaultView}
      data-enabled-views={enableView.join(",")}
      data-list-tools={listTools.join(",")}
      data-show-zoom={String(showZoom)}
    >
      {listDiagram}
    </div>
  ),
}));

describe("OfferingCourseShellPresenter", () => {
  it("configures the shell with only list, sort, and filter capabilities", () => {
    const markup = renderPresenter([]);

    expect(markup).toContain('data-default-view="list"');
    expect(markup).toContain('data-enabled-views="list"');
    expect(markup).toContain('data-list-tools="sort,filter"');
    expect(markup).toContain('data-show-zoom="false"');
  });

  it("renders loading, error, and empty states", () => {
    expect(renderPresenter([], { loading: true })).toContain(
      "Loading offering courses",
    );
    expect(renderPresenter([], { error: "Unavailable" })).toContain(
      'role="alert"',
    );
    expect(renderPresenter([])).toContain("No offering courses found.");
  });

  it("maps the current sorted and filtered row model to unscheduled cards", () => {
    const markup = renderPresenter([
      course("MAT-2", "MAT", "202", "Second in row model", 4, 18),
      course("MAT-1", "MAT", "101", "First in source data", 2, 12),
    ]);

    expect(markup.indexOf("Second in row model")).toBeLessThan(
      markup.indexOf("First in source data"),
    );
    expect(markup).toContain("202");
    expect(markup).toContain("4to");
    expect(markup).toContain("18");
    expect(markup).not.toContain("session-");
    expect(markup).not.toContain("profesor");
    expect(markup).not.toContain("salon");
  });
});

function renderPresenter(
  rows: OfferingCourse[],
  state: { error?: string | null; loading?: boolean } = {},
) {
  return renderToStaticMarkup(
    <OfferingCourseShellPresenter
      config={OFFERING_COURSE_VIEW_CONFIG}
      error={state.error ?? null}
      globalFilter=""
      loading={state.loading ?? false}
      metadata={{ fields: {} } as never}
      onGlobalFilterChange={() => undefined}
      presets={[]}
      table={tableWithRows(rows)}
    />,
  );
}

function tableWithRows(rows: OfferingCourse[]) {
  return {
    getRowModel: () => ({
      rows: rows.map((original) => ({ id: original.key, original })),
    }),
  } as unknown as Table<OfferingCourse>;
}

function course(
  key: string,
  keyCode: string,
  keyNumber: string,
  name: string,
  semester: number,
  estimatedNumber: number,
): OfferingCourse {
  return {
    block: "A",
    credits: 6,
    estimatedNumber,
    hours: 5,
    key,
    keyCode,
    keyNumber,
    name,
    position: 0,
    preRequisites: [],
    semester,
  };
}
