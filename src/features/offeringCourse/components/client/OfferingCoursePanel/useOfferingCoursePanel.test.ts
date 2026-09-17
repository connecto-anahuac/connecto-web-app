import { describe, expect, it } from "vitest";

import type { OfferingCourseDetailDto } from "@/external/dto/offering-course/offering-course.dto";
import type { OfferingCoursePanelPlan } from "./types";
import {
  getOfferingCoursePanelTotal,
  getPlanSelectedEligibleStudentsTotal,
  getTotalSelectedEligibleStudents,
  resolveSemesterEnabled,
} from "./useOfferingCoursePanel";

const plans: OfferingCoursePanelPlan[] = [
  {
    id: "plan-a",
    label: "Plan A",
    recommendedSemester: 2,
    semesters: [
      {
        expectedStudents: [
          { fullName: "Student A", id: "a" },
          { fullName: "Blocked", id: "blocked", isEligible: false },
        ],
        id: "semester-1",
        label: "Semester 1",
        semester: 1,
      },
      {
        expectedStudents: [
          { fullName: "Student A", id: "a" },
          { fullName: "Student B", id: "b" },
        ],
        id: "semester-2",
        label: "Semester 2",
        semester: 2,
      },
    ],
  },
  {
    id: "plan-b",
    label: "Plan B",
    recommendedSemester: 1,
    semesters: [
      {
        expectedStudents: [{ fullName: "Student C", id: "c" }],
        id: "semester-1",
        label: "Semester 1",
        semester: 1,
      },
    ],
  },
];

const selectedIds = {
  "plan-a": ["a", "b", "blocked"],
  "plan-b": ["c"],
};

describe("offering course panel totals", () => {
  it("uses the recommended semester default until an explicit value exists", () => {
    expect(resolveSemesterEnabled(plans[0], plans[0].semesters[0], {})).toBe(
      false,
    );
    expect(resolveSemesterEnabled(plans[0], plans[0].semesters[1], {})).toBe(
      true,
    );
    expect(
      resolveSemesterEnabled(plans[0], plans[0].semesters[1], {
        "plan-a": { "semester-2": false },
      }),
    ).toBe(false);
  });

  it("sums selected eligible students for enabled semesters in one plan", () => {
    expect(getPlanSelectedEligibleStudentsTotal(plans[0], selectedIds, {})).toBe(
      2,
    );
    expect(
      getPlanSelectedEligibleStudentsTotal(plans[0], selectedIds, {
        "plan-a": { "semester-1": true },
      }),
    ).toBe(3);
  });

  it("sums semester totals across plans and excludes disabled semesters", () => {
    expect(getTotalSelectedEligibleStudents(plans, selectedIds, {})).toBe(3);
    expect(
      getTotalSelectedEligibleStudents(plans, selectedIds, {
        "plan-a": { "semester-2": false },
        "plan-b": { "semester-1": false },
      }),
    ).toBe(0);
  });

  it("derives the card estimate from the same detail and state as the panel total", () => {
    const detail: OfferingCourseDetailDto = {
      block: "Base",
      credits: 8,
      estimatedNumber: 2,
      hours: 4,
      key: "TIND-101",
      keyCode: "TIND",
      keyNumber: "101",
      name: "Programming",
      position: 1,
      preRequisites: [],
      semester: 1,
      sessionNumber: 1,
      studyPlans: [
        {
          career: "TIND",
          studyPlanId: "plan-a",
          studyPlanName: "Plan A",
          recommendedSemester: 2,
          semesters: [
            {
              semester: 1,
              eligibleStudents: [{ id: "a", name: "Student A", avatarColorRef: 0 }],
              studentsWithoutPrerequisites: [],
            },
            {
              semester: 2,
              eligibleStudents: [
                { id: "a", name: "Student A", avatarColorRef: 0 },
                { id: "b", name: "Student B", avatarColorRef: 0 },
              ],
              studentsWithoutPrerequisites: [],
            },
          ],
        },
      ],
    };

    expect(
      getOfferingCoursePanelTotal(detail, { "plan-a": ["a", "b"] }, {}),
    ).toBe(2);
    expect(
      getOfferingCoursePanelTotal(
        detail,
        { "plan-a": ["a", "b"] },
        { "plan-a": { "2": false } },
      ),
    ).toBe(0);
  });
});
