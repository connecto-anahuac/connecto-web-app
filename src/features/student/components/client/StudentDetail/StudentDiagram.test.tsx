import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { ComponentProps, ReactNode } from "react";
import type { StudentClassItem } from "@/features/student/types";
import {
  StudentDiagram,
  studentPositionHideId,
  studentSemesterHideId,
} from "./StudentDiagram";

vi.mock("@/features/student/components/ui/ClassCardView", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/shared/component/composite/diagram/Diagram", () => {
  function DiagramRoot({ children }: { children?: ReactNode }) {
    return <div>{children}</div>;
  }

  return {
    Diagram: Object.assign(DiagramRoot, {
      Viewport: ({
        showLocators,
        ...props
      }: ComponentProps<"div"> & { showLocators: boolean }) => (
        <div data-show-locators={showLocators} {...props} />
      ),
      Rows: ({ children }: { children?: ReactNode }) => <>{children}</>,
      Columns: ({ children }: { children?: ReactNode }) => <>{children}</>,
      Content: ({
        locatorTarget,
        x,
        y,
        ...props
      }: ComponentProps<"div"> & {
        locatorTarget?: boolean;
        x: number;
        y: number;
      }) => (
        <div
          data-locator-target={locatorTarget}
          data-x={x}
          data-y={y}
          {...props}
        />
      ),
    }),
  };
});

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

  it("enables locators for a filtered result and targets only matched cards", () => {
    const items = [
      studentClass("matched", "Matched course", 1, 0),
      studentClass("unmatched", "Unmatched course", 1, 1),
    ];

    const markup = renderToStaticMarkup(
      <StudentDiagram
        filterResult={{
          matches: new Map([
            ["matched", { matched: true }],
            ["unmatched", { matched: false }],
          ]),
        }}
        items={items}
      />,
    );

    expect(markup).toContain('data-show-locators="true"');
    expect(markup.match(/data-locator-target="true"/g)).toHaveLength(1);
    expect(markup.match(/data-locator-target="false"/g)).toHaveLength(1);
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
