import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { StudentClassItem } from "@/features/student/types";
import {
  StudentDiagram,
  studentPositionHideId,
  studentSemesterHideId,
} from "./StudentDiagram";

vi.mock("@/features/student/components/ui/ClassCardView", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe("StudentDiagram", () => {
  it("removes cards in hidden semester columns and position rows", () => {
    const items = [
      studentClass("visible", "Visible course", 1, 0),
      studentClass("hidden-semester", "Hidden semester course", 2, 0),
      studentClass("hidden-position", "Hidden position course", 1, 1),
    ];
    const markup = renderToStaticMarkup(
      <StudentDiagram
        filterResult={{
          matches: new Map(items.map((item) => [item.id, { matched: true }])),
        }}
        hiddenItemIds={
          new Set([studentSemesterHideId(2), studentPositionHideId(1)])
        }
        items={items}
      />,
    );

    expect(markup).toContain("Semestre 1");
    expect(markup).not.toContain("Semestre 2");
    expect(markup).toContain("Visible course");
    expect(markup).not.toContain("Hidden semester course");
    expect(markup).not.toContain("Hidden position course");
  });
});

function studentClass(
  id: string,
  name: string,
  semester: number,
  position: number,
): StudentClassItem {
  return {
    id,
    keyCode: "TIND",
    keyNumber: id,
    name,
    semester,
    position,
  } as StudentClassItem;
}
