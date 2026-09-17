import { renderToStaticMarkup } from "react-dom/server";
import type { Table } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import { DataSearchProvider } from "@/shared/store/filter/FilterProvider";
import { OfferingCourseShellPresenter } from "./OfferingCourseShellPresenter";
import {
  SCHEDULE_BUILDER_OFFERING_COURSE_VIEW_CONFIG,
  type ScheduleBuilderOfferingCourse,
} from "./scheduleBuilderOfferingCourse";

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
  rows: ScheduleBuilderOfferingCourse[],
  state: { error?: string | null; loading?: boolean } = {},
) {
  return renderToStaticMarkup(
    <DataSearchProvider scopeId="offering-course-presenter-test">
      <OfferingCourseShellPresenter
        config={SCHEDULE_BUILDER_OFFERING_COURSE_VIEW_CONFIG}
        error={state.error ?? null}
        globalFilter=""
        loading={state.loading ?? false}
        metadata={{ optionsByFieldId: {} }}
        onGlobalFilterChange={() => undefined}
        presets={[]}
        table={tableWithRows(rows)}
      />
    </DataSearchProvider>,
  );
}

function tableWithRows(rows: ScheduleBuilderOfferingCourse[]) {
  return {
    getRowModel: () => ({
      rows: rows.map((original) => ({ id: original.key, original })),
    }),
  } as unknown as Table<ScheduleBuilderOfferingCourse>;
}

function course(
  key: string,
  keyCode: string,
  keyNumber: string,
  name: string,
  semester: number,
  estimatedNumber: number,
): ScheduleBuilderOfferingCourse {
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
