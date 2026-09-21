import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS,
  type ScheduleBuilderOfferingCourse,
} from "./scheduleBuilderOfferingCourse";
import {
  FilterContext,
  FilterScopeContext,
} from "@/shared/store/filter/FilterProvider";
import { createFilterStore } from "@/shared/store/filter/filterStore";
import {
  createRecommendedSemesterPresetConfigs,
  useOfferingCourseShellTable,
} from "./useOfferingCourseShellTable";

describe("createRecommendedSemesterPresetConfigs", () => {
  it("creates one sorted preset per available recommended semester", () => {
    const presets = createRecommendedSemesterPresetConfigs([
      course("A", 4),
      course("B", 2),
      course("C", 4),
    ]);

    expect(presets).toEqual([
      {
        label: "Semestre 2",
        filterKey: SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.semester,
        conditionValue: 2,
        operator: "eq",
      },
      {
        label: "Semestre 4",
        filterKey: SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.semester,
        conditionValue: 4,
        operator: "eq",
      },
    ]);
  });

  it("integrates search, filter, sort, and preset toggling with the real table", () => {
    const store = createFilterStore();
    const data = [
      course("A", 2, "Alpha"),
      course("B", 4, "Beta"),
      course("C", 4, "Gamma"),
    ];

    let result = renderTableHook(store, data);
    result.setGlobalFilter("beta");
    result = renderTableHook(store, data);
    expect(rowKeys(result)).toEqual(["B"]);

    result.setGlobalFilter("");
    result = renderTableHook(store, data);
    store.getState().upsertCondition("offering-course-shell-test", {
      fieldId: SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.semester,
      operator: "eq",
      value: 4,
    });
    result = renderTableHook(store, data);
    expect(rowKeys(result)).toEqual(["B", "C"]);

    store
      .getState()
      .removeCondition(
        "offering-course-shell-test",
        SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.semester,
      );
    result = renderTableHook(store, data);
    const semesterTwo = result.presets.find(
      (preset) => preset.label === "Semestre 2",
    );
    semesterTwo?.onToggle();
    result = renderTableHook(store, data);
    expect(rowKeys(result)).toEqual(["A"]);
    expect(
      result.presets.find((preset) => preset.label === "Semestre 2")
        ?.isSelected,
    ).toBe(true);

    result.presets
      .find((preset) => preset.label === "Semestre 2")
      ?.onToggle();
    result = renderTableHook(store, data);
    expect(rowKeys(result)).toEqual(["A", "B", "C"]);

    result.table.setOptions((previous) => ({
      ...previous,
      state: {
        ...previous.state,
        sorting: [{
          id: SCHEDULE_BUILDER_OFFERING_COURSE_FILTER_KEYS.name,
          desc: true,
        }],
      },
    }));
    expect(rowKeys(result)).toEqual(["C", "B", "A"]);
  });
});

function renderTableHook(
  store: ReturnType<typeof createFilterStore>,
  data: ScheduleBuilderOfferingCourse[],
) {
  let value: ReturnType<typeof useOfferingCourseShellTable> | undefined;

  // Server rendering reads Zustand's server snapshot. Refresh it between
  // renders to model the successive client renders driven by store updates.
  store.getInitialState = store.getState;

  function Probe() {
    value = useOfferingCourseShellTable(data);
    return null;
  }

  renderToStaticMarkup(
    createElement(
      FilterContext.Provider,
      { value: store },
      createElement(
        FilterScopeContext.Provider,
        { value: "offering-course-shell-test" },
        createElement(Probe),
      ),
    ),
  );

  if (!value) throw new Error("Hook did not render");
  return value;
}

function rowKeys(result: ReturnType<typeof useOfferingCourseShellTable>) {
  return result.table.getRowModel().rows.map((row) => row.original.key);
}

function course(
  key: string,
  semester: number,
  name = key,
): ScheduleBuilderOfferingCourse {
  return {
    block: "A",
    credits: 6,
    estimatedNumber: 10,
    hours: 5,
    key,
    keyCode: key,
    keyNumber: "100",
    name,
    position: 0,
    preRequisites: [],
    semester,
  };
}
