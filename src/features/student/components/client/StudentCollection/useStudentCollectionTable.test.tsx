import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { CellContext } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import { Period } from "@/shared/types/Period";
import type { StudentCollectionItem } from "./studentCollection.type";
import {
  STUDENT_COLLECTION_CELL_RENDERERS,
  useStudentCollectionTable,
} from "./useStudentCollectionTable";
import { StudentStatus } from "@/shared/types/consts";
import {
  FilterContext,
  FilterScopeContext,
} from "@/shared/store/filter/FilterProvider";
import {
  createFilterStore,
  getSearchQuery,
} from "@/shared/store/filter/filterStore";
import { getOperatorsForValueType } from "@/shared/service/dataPipeline/operatorPolicy";
import {
  STUDENT_COLLECTION_PRESETS,
  STUDENT_COLLECTION_VIEW_CONFIG,
} from "./studentClassViewConfig";

const TEST_SCOPE = "student-collection-table-test";

describe("STUDENT_COLLECTION_CELL_RENDERERS", () => {
  it("renders the student name with initials and the established avatar color", () => {
    const markup = renderToStaticMarkup(
      STUDENT_COLLECTION_CELL_RENDERERS.name?.(contextFor({
        name: "Ada Lovelace",
        avatarColorRef: 6,
      })),
    );

    expect(markup).toContain("AL");
    expect(markup).toContain("Ada Lovelace");
    expect(markup).toContain("background-color:var(--FIS-strong)");
  });

  it("uses the active visual tone only for active students", () => {
    const activeMarkup = renderToStaticMarkup(
      STUDENT_COLLECTION_CELL_RENDERERS.status?.(contextFor({
        status: StudentStatus.ACTIVE,
      })),
    );
    const inactiveMarkup = renderToStaticMarkup(
      STUDENT_COLLECTION_CELL_RENDERERS.status?.(contextFor({
        status: StudentStatus.BAJA_ACADEMICA,
      })),
    );

    expect(activeMarkup).toContain("bg-StatusGood");
    expect(inactiveMarkup).toContain("text-OnSurfaceVariant");
  });
});

describe("STUDENT_COLLECTION_PRESETS", () => {
  it("declares operators compatible with each preset field", () => {
    for (const preset of STUDENT_COLLECTION_PRESETS) {
      const field = STUDENT_COLLECTION_VIEW_CONFIG.fields.find(
        (candidate) => candidate.fieldId === preset.filterKey,
      );

      expect(field, `Missing field ${preset.filterKey}`).toBeDefined();
      expect(getOperatorsForValueType(field!.valueType)).toContain(
        preset.operator,
      );
    }
  });

  it("creates and selects the numeric greater-than preset", () => {
    const store = createFilterStore();
    store.getState().upsertCondition(TEST_SCOPE, {
      fieldId: "failedClassCount",
      operator: "gte",
      value: 0,
    });

    let result = renderTableHook(store);
    const failedPreset = result.presets.find(
      (preset) => preset.label === "Reprobado",
    );
    expect(failedPreset?.isSelected).toBe(false);

    failedPreset?.onToggle();
    expect(getSearchQuery(store.getState(), TEST_SCOPE).conditions).toContainEqual({
      fieldId: "failedClassCount",
      operator: "gt",
      value: 0,
    });

    result = renderTableHook(store);
    expect(
      result.presets.find((preset) => preset.label === "Reprobado")
        ?.isSelected,
    ).toBe(true);
  });

  it("keeps enum presets on the in operator and toggles them off", () => {
    const store = createFilterStore();
    let result = renderTableHook(store);

    result.presets.find((preset) => preset.label === "Activo")?.onToggle();
    expect(getSearchQuery(store.getState(), TEST_SCOPE).conditions).toContainEqual({
      fieldId: "status",
      operator: "in",
      value: [StudentStatus.ACTIVE],
    });

    result = renderTableHook(store);
    const activePreset = result.presets.find(
      (preset) => preset.label === "Activo",
    );
    expect(activePreset?.isSelected).toBe(true);
    activePreset?.onToggle();
    expect(getSearchQuery(store.getState(), TEST_SCOPE).conditions).toEqual([]);
  });
});

function renderTableHook(store: ReturnType<typeof createFilterStore>) {
  let value: ReturnType<typeof useStudentCollectionTable> | undefined;

  store.getInitialState = store.getState;

  function Probe() {
    value = useStudentCollectionTable([]);
    return null;
  }

  renderToStaticMarkup(
    createElement(
      FilterContext.Provider,
      { value: store },
      createElement(
        FilterScopeContext.Provider,
        { value: TEST_SCOPE },
        createElement(Probe),
      ),
    ),
  );

  if (!value) throw new Error("Hook did not render");
  return value;
}

function contextFor(
  overrides: Partial<StudentCollectionItem>,
): CellContext<StudentCollectionItem, unknown> {
  return {
    row: {
      original: {
        studentId: "1",
        name: "Ada Lovelace",
        avatarColorRef: 0,
        status: "activo",
        career: "Industrial",
        currentSemester: 3,
        enrolledPeriod: new Period("202460"),
        classProgress: 50,
        failedClassCount: 0,
        contacts: "",
        ...overrides,
      },
    },
  } as CellContext<StudentCollectionItem, unknown>;
}
