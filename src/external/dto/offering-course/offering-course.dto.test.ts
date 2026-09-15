import { describe, expect, it } from "vitest";
import {
  toOfferingCourseDto,
  toOfferingCourseDetailDto,
  toSelectedOfferingCourseDto,
} from "./offering-course.dto";

describe("offering course DTOs", () => {
  it("includes the grid estimate without student identifiers", () => {
    expect(toOfferingCourseDto({
      key: "course", keyCode: "A", keyNumber: "1", hours: 3, credits: 3,
      block: "", name: "Course", semester: 1, position: 1, estimatedNumber: 4,
      preRequisites: [],
    })).toMatchObject({ estimatedNumber: 4 });
  });

  it("exposes enabled IDs and the study-plan estimate without leaking mutable arrays", () => {
    const enabledStudentIdsByStudyPlan = { plan: ["student"] };
    const detail = toOfferingCourseDetailDto({
      key: "course",
      keyCode: "A",
      keyNumber: "1",
      hours: 3,
      credits: 3,
      block: "",
      name: "Course",
      semester: 1,
      position: 1,
      estimatedNumber: 1,
      preRequisites: [],
      studyPlans: [],
      enabledStudentIdsByStudyPlan,
      sessionNumber: 2,
    });

    detail.enabledStudentIdsByStudyPlan?.plan.push("other");

    expect(enabledStudentIdsByStudyPlan).toEqual({ plan: ["student"] });

    expect(toSelectedOfferingCourseDto({
      id: "selection",
      period: "202660",
      career: "C",
      courseKey: "course",
      sessionNumber: 2,
      estimatedNumber: 1,
      enabledStudentIdsByStudyPlan: { plan: ["student", "student"] },
    })).toMatchObject({
      period: "202660",
      estimatedNumber: 1,
      enabledStudentIdsByStudyPlan: { plan: ["student"] },
    });
    expect(detail.enabledStudentIdsByStudyPlan).toEqual({ plan: ["student", "other"] });
  });
});
