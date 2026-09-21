import type { ComponentProps, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { StudyPlanCourseDto } from "@/external/dto/study-plan/study-plan.dto";
import { PlanCourseDiagram } from "./PlanCourseDiagram";

vi.mock("./ClassCardView", () => ({
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

describe("PlanCourseDiagram", () => {
  it("enables locators for a filtered result and targets only matched courses", () => {
    const courses = [
      course("matched", "Matched course", 1, 0),
      course("unmatched", "Unmatched course", 2, 0),
    ];

    const markup = renderToStaticMarkup(
      <PlanCourseDiagram
        courses={courses}
        filterResult={{
          matches: new Map([
            ["matched", { matched: true }],
            ["unmatched", { matched: false }],
          ]),
        }}
      />,
    );

    expect(markup).toContain('data-show-locators="true"');
    expect(markup.match(/data-locator-target="true"/g)).toHaveLength(1);
    expect(markup.match(/data-locator-target="false"/g)).toHaveLength(1);
  });

  it("keeps locators disabled when every course matches", () => {
    const courses = [course("matched", "Matched course", 1, 0)];

    const markup = renderToStaticMarkup(
      <PlanCourseDiagram
        courses={courses}
        filterResult={{
          matches: new Map([["matched", { matched: true }]]),
        }}
      />,
    );

    expect(markup).toContain('data-show-locators="false"');
  });
});

function course(
  id: string,
  name: string,
  semester: number,
  position: number,
): StudyPlanCourseDto {
  return {
    id,
    name,
    semester,
    position,
    keyCode: "TIND",
    keyNumber: id,
    credits: 3,
    hours: 4,
  } as StudyPlanCourseDto;
}
