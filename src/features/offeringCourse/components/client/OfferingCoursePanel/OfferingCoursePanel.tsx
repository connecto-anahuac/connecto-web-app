"use client";

import type { ComponentProps } from "react";
import { OfferingCoursePanelPresenter } from "./OfferingCoursePanelPresenter";
import { useScheduleBuilderStore } from "../ScheduleBuilder/ScheduleBuilderStateProvider";
import type {
  OfferingCoursePanelPlan,
  EnabledStudentIdsByStudyPlan,
  SelectedStudentIdsByStudyPlan,
} from "./types";
import { useOfferingCoursePanel } from "./useOfferingCoursePanel";

export type OfferingCoursePanelProps = ComponentProps<"aside"> & {
  /** Fallback used by isolated stories; the provider detail takes precedence. */
  courseName?: string;
  errorMessage?: string;
  initialSessionCount?: number;
  isLoading?: boolean;
  onClose?: () => void;
  onSelectedPlanChange?: (planId: string) => void;
  onSessionCountChange?: (count: number) => void;
  /** @deprecated Use onStudentEnabledChange. */
  onStudentSelectionChange?: (
    planId: string,
    semesterId: string,
    studentId: string,
    isSelected: boolean,
  ) => void;
  /** Fallback used by isolated stories; the provider detail takes precedence. */
  plans?: OfferingCoursePanelPlan[];
  selectedPlanId?: string;
  /** Called when a student's offering state changes. */
  onStudentEnabledChange?: (
    planId: string,
    semesterId: string,
    studentId: string,
    isEnabled: boolean,
  ) => void;
  /** Initial selection fallback for isolated use without a store draft. */
  enabledStudentIdsByStudyPlan?: EnabledStudentIdsByStudyPlan;
  /** @deprecated Use enabledStudentIdsByStudyPlan. */
  selectedStudentIdsByStudyPlan?: SelectedStudentIdsByStudyPlan;
  sessionCount?: number;
};

/**
 * Container for the offering drawer. Interaction state comes from the closest
 * ScheduleBuilder provider so the panel and the course cards never drift apart.
 */
export default function OfferingCoursePanel({
  courseName,
  errorMessage,
  initialSessionCount = 1,
  isLoading = false,
  onClose,
  onSelectedPlanChange,
  onSessionCountChange,
  onStudentEnabledChange,
  onStudentSelectionChange,
  plans: plansProp,
  selectedPlanId: selectedPlanIdProp,
  enabledStudentIdsByStudyPlan: enabledStudentIdsByStudyPlanProp,
  selectedStudentIdsByStudyPlan: selectedStudentIdsByStudyPlanProp,
  sessionCount: sessionCountProp,
  ...props
}: OfferingCoursePanelProps) {
  const selectedCourseDetail = useScheduleBuilderStore(
    (state) => state.selectedCourseDetail,
  );
  const selectedCourseKey = useScheduleBuilderStore(
    (state) => state.selectedCourseKey,
  );
  const semesterEnabledByCourse = useScheduleBuilderStore(
    (state) => state.semesterEnabledByCourse,
  );
  const selectedStudyPlanId = useScheduleBuilderStore(
    (state) => state.selectedStudyPlanId,
  );
  const storeDraft = useScheduleBuilderStore((state) =>
    state.selectedCourseKey ? (state.drafts[state.selectedCourseKey] ?? null) : null,
  );
  const setSelectedStudyPlanId = useScheduleBuilderStore(
    (state) => state.setSelectedStudyPlanId,
  );
  const setSelectedStudentIds = useScheduleBuilderStore(
    (state) => state.setSelectedStudentIds,
  );
  const setSessionNumber = useScheduleBuilderStore(
    (state) => state.setSessionNumber,
  );
  const setSemesterEnabled = useScheduleBuilderStore(
    (state) => state.setSemesterEnabled,
  );
  const closePanel = useScheduleBuilderStore((state) => state.closePanel);
  const detailError = useScheduleBuilderStore((state) => state.detailError);
  const detailLoading = useScheduleBuilderStore((state) => state.detailLoading);
  const plans: OfferingCoursePanelPlan[] = selectedCourseDetail
    ? selectedCourseDetail.studyPlans.map((studyPlan) => ({
        id: studyPlan.studyPlanId,
        label: studyPlan.studyPlanName,
        recommendedSemester: studyPlan.recommendedSemester,
        semesters: studyPlan.semesters.map((semester) => ({
          expectedStudents: semester.eligibleStudents.map((student) => ({
            fullName: student.name,
            id: student.id,
          })),
          id: String(semester.semester),
          label: `Semestre ${semester.semester}`,
          semester: semester.semester,
          studentsWithoutPrerequisites: semester.studentsWithoutPrerequisites.map(
            (student) => ({ fullName: student.name, id: student.id }),
          ),
        })),
      }))
    : (plansProp ?? []);
  const panel = useOfferingCoursePanel({
    initialSessionCount,
    initialEnabledStudentIdsByStudyPlan:
      enabledStudentIdsByStudyPlanProp ?? selectedStudentIdsByStudyPlanProp,
    plans,
    selectedPlanId: selectedStudyPlanId ?? selectedPlanIdProp,
    enabledStudentIdsByStudyPlan: storeDraft?.enabledStudentIdsByStudyPlan,
    semesterEnabledByStudyPlan: selectedCourseKey
      ? (semesterEnabledByCourse[selectedCourseKey] ?? {})
      : undefined,
    sessionCount: storeDraft?.sessionNumber ?? sessionCountProp,
  });
  return (
    <OfferingCoursePanelPresenter
      {...props}
      courseName={selectedCourseDetail?.name ?? courseName ?? "Course details"}
      errorMessage={detailError ?? errorMessage}
      isLoading={detailLoading || isLoading}
      onClose={() => {
        closePanel();
        onClose?.();
      }}
      onPlanChange={(planId) => {
        panel.setSelectedPlanId(planId);
        setSelectedStudyPlanId(planId);
        onSelectedPlanChange?.(planId);
      }}
      onSessionCountChange={(count) => {
        panel.setSessionCount(count);
        setSessionNumber(count);
        onSessionCountChange?.(count);
      }}
      onSemesterEnabledChange={(semesterId, isEnabled) => {
        const planId = panel.selectedPlanId;
        if (selectedCourseKey) {
          setSemesterEnabled(
            selectedCourseKey,
            planId,
            semesterId,
            isEnabled,
          );
        } else {
          panel.setSemesterEnabledByStudyPlan((current) => ({
            ...current,
            [planId]: {
              ...current[planId],
              [semesterId]: isEnabled,
            },
          }));
        }
      }}
      onStudentSelectionChange={(semesterId, studentId, isSelected) => {
        const planId = panel.selectedPlanId;
        if (!storeDraft)
          panel.setSelectedStudentIdsByStudyPlan((current) => ({
            ...current,
            [planId]: isSelected
              ? [...new Set([...(current[planId] ?? []), studentId])]
              : (current[planId] ?? []).filter((id) => id !== studentId),
          }));
        setSelectedStudentIds(planId, studentId, isSelected);
        onStudentEnabledChange?.(planId, semesterId, studentId, isSelected);
        onStudentSelectionChange?.(planId, semesterId, studentId, isSelected);
      }}
      planTotal={panel.planTotal}
      plans={plans}
      selectedPlan={panel.selectedPlan}
      selectedPlanId={panel.selectedPlanId}
      enabledStudentIdsByStudyPlan={panel.enabledStudentIdsByStudyPlan}
      sessionCount={panel.sessionCount}
      semesterEnabledByStudyPlan={panel.semesterEnabledByStudyPlan}
      totalSelectedStudents={panel.totalSelectedStudents}
    />
  );
}

export type {
  OfferingCoursePanelPlan,
  OfferingCoursePanelSemester,
  OfferingCoursePanelStudent,
  EnabledStudentIdsByStudyPlan,
  SelectedStudentIdsByStudyPlan,
} from "./types";
