"use client";

import { useMemo, useState } from "react";

import type {
  OfferingCoursePanelPlan,
  OfferingCoursePanelSemester,
  EnabledStudentIdsByStudyPlan,
} from "./types";

type Options = {
  initialSessionCount: number;
  initialEnabledStudentIdsByStudyPlan?: EnabledStudentIdsByStudyPlan;
  plans: OfferingCoursePanelPlan[];
  selectedPlanId?: string;
  /** Controlled value supplied by the ScheduleBuilder store when a draft exists. */
  enabledStudentIdsByStudyPlan?: EnabledStudentIdsByStudyPlan;
  semesterEnabledByStudyPlan?: SemesterEnabledByStudyPlan;
  sessionCount?: number;
};

export type SemesterEnabledByStudyPlan = Record<
  string,
  Record<string, boolean>
>;

export function resolveSemesterEnabled(
  plan: OfferingCoursePanelPlan,
  semester: OfferingCoursePanelSemester,
  semesterEnabledByStudyPlan: SemesterEnabledByStudyPlan,
) {
  return (
    semesterEnabledByStudyPlan[plan.id]?.[semester.id] ??
    (semester.semester ?? 0) >= (plan.recommendedSemester ?? 0)
  );
}

export function getPlanSelectedEligibleStudentsTotal(
  plan: OfferingCoursePanelPlan,
  enabledStudentIdsByStudyPlan: EnabledStudentIdsByStudyPlan,
  semesterEnabledByStudyPlan: SemesterEnabledByStudyPlan,
) {
  const selectedIds = new Set(enabledStudentIdsByStudyPlan[plan.id] ?? []);

  return plan.semesters.reduce((total, semester) => {
    if (!resolveSemesterEnabled(plan, semester, semesterEnabledByStudyPlan))
      return total;

    return (
      total +
      semester.expectedStudents.filter(
        (student) =>
          student.isEligible !== false && selectedIds.has(student.id),
      ).length
    );
  }, 0);
}

export function getTotalSelectedEligibleStudents(
  plans: OfferingCoursePanelPlan[],
  enabledStudentIdsByStudyPlan: EnabledStudentIdsByStudyPlan,
  semesterEnabledByStudyPlan: SemesterEnabledByStudyPlan,
) {
  return plans.reduce(
    (total, plan) =>
      total +
      getPlanSelectedEligibleStudentsTotal(
        plan,
        enabledStudentIdsByStudyPlan,
        semesterEnabledByStudyPlan,
      ),
    0,
  );
}

export function useOfferingCoursePanel({
  initialSessionCount,
  initialEnabledStudentIdsByStudyPlan,
  plans,
  selectedPlanId: selectedPlanIdProp,
  enabledStudentIdsByStudyPlan: enabledStudentIdsByStudyPlanProp,
  semesterEnabledByStudyPlan: semesterEnabledByStudyPlanProp,
  sessionCount: sessionCountProp,
}: Options) {
  const [uncontrolledPlanId, setUncontrolledPlanId] = useState(
    selectedPlanIdProp ?? plans[0]?.id ?? "",
  );
  const [uncontrolledSessionCount, setUncontrolledSessionCount] =
    useState(initialSessionCount);
  const [uncontrolledSelectedStudentIds, setUncontrolledSelectedStudentIds] =
    useState<EnabledStudentIdsByStudyPlan>(
      // Panel props are a fallback initial value for isolated, store-free usage.
      () => initialEnabledStudentIdsByStudyPlan ?? {},
    );
  const [uncontrolledSemesterEnabledByStudyPlan, setSemesterEnabledByStudyPlan] =
    useState<SemesterEnabledByStudyPlan>({});
  const requestedPlanId = selectedPlanIdProp ?? uncontrolledPlanId;
  const selectedPlanId = plans.some((plan) => plan.id === requestedPlanId)
    ? requestedPlanId
    : (plans[0]?.id ?? "");
  const sessionCount = sessionCountProp ?? uncontrolledSessionCount;
  const enabledStudentIdsByStudyPlan =
    enabledStudentIdsByStudyPlanProp ?? uncontrolledSelectedStudentIds;
  const semesterEnabledByStudyPlan =
    semesterEnabledByStudyPlanProp ?? uncontrolledSemesterEnabledByStudyPlan;

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? null;
  const planTotal = useMemo(
    () =>
      selectedPlan
        ? getPlanSelectedEligibleStudentsTotal(
            selectedPlan,
            enabledStudentIdsByStudyPlan,
            semesterEnabledByStudyPlan,
          )
        : 0,
    [enabledStudentIdsByStudyPlan, selectedPlan, semesterEnabledByStudyPlan],
  );
  const totalSelectedStudents = useMemo(
    () =>
      getTotalSelectedEligibleStudents(
        plans,
        enabledStudentIdsByStudyPlan,
        semesterEnabledByStudyPlan,
      ),
    [enabledStudentIdsByStudyPlan, plans, semesterEnabledByStudyPlan],
  );
  return {
    planTotal,
    selectedPlan,
    selectedPlanId,
    enabledStudentIdsByStudyPlan,
    sessionCount,
    setSelectedPlanId: setUncontrolledPlanId,
    setSessionCount: setUncontrolledSessionCount,
    setSelectedStudentIdsByStudyPlan: setUncontrolledSelectedStudentIds,
    semesterEnabledByStudyPlan,
    setSemesterEnabledByStudyPlan,
    totalSelectedStudents,
  };
}
