import type { StudyPlanCourseDto } from "@/external/dto/study-plan/study-plan.dto";
import { describe, expect, it } from "vitest";

import { buildPlanDiagramSelection } from "./usePlanDiagramSelection";

describe("buildPlanDiagramSelection", () => {
  it("resolves direct and indirect prerequisites by course key", () => {
    const courses = [
      course("foundation-id", "FOUNDATION"),
      course("intermediate-id", "INTERMEDIATE", ["FOUNDATION"]),
      course("selected-id", "SELECTED", ["INTERMEDIATE"]),
      course("unrelated-id", "UNRELATED"),
    ];

    const result = buildPlanDiagramSelection("selected-id", courses);

    expect(result.highlightedIds).toEqual(
      new Set(["selected-id", "intermediate-id", "foundation-id"]),
    );
    expect(result.edges).toEqual([
      { prerequisiteId: "intermediate-id", courseId: "selected-id" },
      { prerequisiteId: "foundation-id", courseId: "intermediate-id" },
    ]);
  });

  it("deduplicates branches, terminates cycles, and omits courses outside the plan", () => {
    const courses = [
      course("foundation-id", "FOUNDATION", ["SELECTED"]),
      course("left-id", "LEFT", ["FOUNDATION", "FOUNDATION", "OUTSIDE"]),
      course("right-id", "RIGHT", ["FOUNDATION"]),
      course("selected-id", "SELECTED", ["LEFT", "RIGHT"]),
    ];

    const result = buildPlanDiagramSelection("selected-id", courses);

    expect(result.highlightedIds).toEqual(
      new Set(["selected-id", "left-id", "right-id", "foundation-id"]),
    );
    expect(result.edges).toHaveLength(5);
    expect(result.edges).not.toContainEqual(
      expect.objectContaining({ prerequisiteId: "OUTSIDE" }),
    );
    expect(result.edges).toContainEqual({
      prerequisiteId: "selected-id",
      courseId: "foundation-id",
    });
  });

  it("returns an empty selection for an id outside the plan", () => {
    expect(
      buildPlanDiagramSelection("missing", [course("course-id", "COURSE")]),
    ).toEqual({ highlightedIds: new Set(), edges: [] });
  });
});

function course(
  id: string,
  courseKey: string,
  preRequisites: string[] = [],
): StudyPlanCourseDto {
  return {
    id,
    courseKey,
    keyCode: "TIND",
    keyNumber: id,
    name: id,
    hours: 4,
    credits: 3,
    semester: 1,
    position: 0,
    preRequisites,
  };
}
