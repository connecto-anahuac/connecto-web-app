"use client";

import { useMemo, useState } from "react";

import type {
  OfferingCoursePanelPlan,
  EnabledStudentIdsByStudyPlan,
} from "./types";

type Options = {
  initialSessionCount: number;
  plans: OfferingCoursePanelPlan[];
  selectedPlanId?: string;
  enabledStudentIdsByStudyPlan?: EnabledStudentIdsByStudyPlan;
  sessionCount?: number;
};

export function useOfferingCoursePanel({
  initialSessionCount,
  plans,
  selectedPlanId: selectedPlanIdProp,
  enabledStudentIdsByStudyPlan: enabledStudentIdsByStudyPlanProp,
  sessionCount: sessionCountProp,
}: Options) {
  const [uncontrolledPlanId, setUncontrolledPlanId] = useState(
    selectedPlanIdProp ?? plans[0]?.id ?? "",
  );
  const [uncontrolledSessionCount, setUncontrolledSessionCount] =
    useState(initialSessionCount);
  const [uncontrolledSelectedStudentIds, setUncontrolledSelectedStudentIds] =
    useState<EnabledStudentIdsByStudyPlan>({});
  const requestedPlanId = selectedPlanIdProp ?? uncontrolledPlanId;
  const selectedPlanId = plans.some((plan) => plan.id === requestedPlanId)
    ? requestedPlanId
    : (plans[0]?.id ?? "");
  const sessionCount = sessionCountProp ?? uncontrolledSessionCount;
  const enabledStudentIdsByStudyPlan =
    enabledStudentIdsByStudyPlanProp ?? uncontrolledSelectedStudentIds;

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? null;
  const planTotal = useMemo(
    () => new Set(enabledStudentIdsByStudyPlan[selectedPlanId] ?? []).size,
    [enabledStudentIdsByStudyPlan, selectedPlanId],
  );
  const totalSelectedStudents = useMemo(
    () =>
      Object.values(enabledStudentIdsByStudyPlan).reduce(
        (total, studentIds) => total + new Set(studentIds).size,
        0,
      ),
    [enabledStudentIdsByStudyPlan],
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
    totalSelectedStudents,
  };
}
