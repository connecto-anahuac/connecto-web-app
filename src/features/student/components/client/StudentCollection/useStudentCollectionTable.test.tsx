import { renderToStaticMarkup } from "react-dom/server";
import type { CellContext } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import { Period } from "@/shared/types/Period";
import type { StudentCollectionItem } from "./studentCollection.type";
import { STUDENT_COLLECTION_CELL_RENDERERS } from "./useStudentCollectionTable";
import { StudentStatus } from "@/shared/types/consts";

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
