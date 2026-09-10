"use client";

import type { ComponentProps } from "react";
import GenerationAcordion from "@/features/offeringCourse/components/client/GeneratioinAcordion/GenerationAcordion";
import CloseIcon from "@/shared/component/primitive/icon/CloseIcon";
import PanelToLeftIcon from "@/shared/component/primitive/icon/PanelToLeftIcon";
import PersonIcon from "@/shared/component/primitive/icon/PersonIcon";
import { cn } from "@/shared/lib/util";
import type {
  OfferingCoursePanelPlan,
  EnabledStudentIdsByStudyPlan,
} from "./types";

export type OfferingCoursePanelPresenterProps = ComponentProps<"aside"> & {
  courseName: string;
  errorMessage?: string;
  isLoading: boolean;
  onClose?: () => void;
  onPlanChange: (planId: string) => void;
  onSessionCountChange: (count: number) => void;
  onStudentSelectionChange: (
    semesterId: string,
    studentId: string,
    isSelected: boolean,
  ) => void;
  planTotal: number;
  plans: OfferingCoursePanelPlan[];
  selectedPlan: OfferingCoursePanelPlan | null;
  selectedPlanId: string;
  enabledStudentIdsByStudyPlan: EnabledStudentIdsByStudyPlan;
  sessionCount: number;
  totalSelectedStudents: number;
};

/** Stateless visual representation of the course-offering drawer. */
export function OfferingCoursePanelPresenter({
  className,
  courseName,
  errorMessage,
  isLoading,
  onClose,
  onPlanChange,
  onSessionCountChange,
  onStudentSelectionChange,
  planTotal,
  plans,
  selectedPlan,
  selectedPlanId,
  enabledStudentIdsByStudyPlan,
  sessionCount,
  totalSelectedStudents,
  ...props
}: OfferingCoursePanelPresenterProps) {
  return (
    <aside
      aria-label={`${courseName} offering details`}
      className={cn(
        "flex h-full min-h-0 w-75 flex-col overflow-hidden rounded-lg border border-DividerMiddle bg-SurfaceContainerLowest text-OnSurface shadow-[-4px_0_8.2px_rgb(0_0_0_/_0.12)]",
        className,
      )}
      {...props}
    >
      <header className="flex min-h-10 items-center gap-3 px-2 py-2">
        <PanelToLeftIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-OnSurface"
        />
        <div className="min-w-0 flex-1 px-3">
          <p className="truncate text-xs font-medium">{courseName}</p>
        </div>
        <button
          aria-label="Close offering course panel"
          className="grid size-6 shrink-0 place-items-center rounded text-OnSurface transition-colors hover:bg-DividerLow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary"
          onClick={onClose}
          type="button"
        >
          <CloseIcon aria-hidden="true" className="size-4" />
        </button>
      </header>
      {!isLoading && !errorMessage && plans.length > 0 ? (
        <div className="px-5 pb-2.5">
          <div
            aria-label="Study plans"
            className="flex items-center gap-1 border-b border-DividerMiddle"
            role="tablist"
          >
            {plans.map((plan) => {
              const isSelected = plan.id === selectedPlanId;
              return (
                <button
                  aria-selected={isSelected}
                  className={cn(
                    "rounded px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary",
                    isSelected
                      ? "bg-DividerLow text-OnSurface"
                      : "text-OnSurface-60 hover:bg-DividerLowest",
                  )}
                  key={plan.id}
                  onClick={() => onPlanChange(plan.id)}
                  role="tab"
                  type="button"
                >
                  {plan.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5">
        {isLoading ? (
          <p className="py-6 text-sm text-Outline" role="status">
            Loading eligible students…
          </p>
        ) : null}
        {errorMessage ? (
          <p className="py-6 text-sm text-Error" role="alert">
            {errorMessage}
          </p>
        ) : null}
        {!isLoading && !errorMessage && plans.length === 0 ? (
          <p className="py-6 text-sm text-Outline">
            No study plans are available for this course.
          </p>
        ) : null}
        {!isLoading && !errorMessage && selectedPlan ? (
          <>
            <div className="flex items-center justify-end gap-2 py-2 text-Outline">
              <span className="text-xs font-medium">
                {selectedPlan.label} total
              </span>
              <PersonIcon className="size-4" />
              <span className="text-sm font-medium">{planTotal}</span>
            </div>
            {selectedPlan.semesters.length === 0 ? (
              <p className="py-6 text-sm text-Outline">
                No eligible semesters are available in this study plan.
              </p>
            ) : (
              <div className="flex flex-col gap-0">
                {selectedPlan.semesters.map((semester) => (
                  <div key={semester.id}>
                    <GenerationAcordion
                      expectedStudents={semester.expectedStudents}
                      isMulti={semester.isMulti}
                      onStudentSelectionChange={(studentId, isSelected) =>
                        onStudentSelectionChange(
                          semester.id,
                          studentId,
                          isSelected,
                        )
                      }
                      semesterLabel={semester.label}
                      selectedStudentIds={
                        enabledStudentIdsByStudyPlan[selectedPlan.id] ?? []
                      }
                      studentsWithoutPrerequisites={
                        semester.studentsWithoutPrerequisites
                      }
                    />
                    <div
                      aria-hidden="true"
                      className="h-px w-full bg-DividerLow"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
      <footer className="border-t border-DividerMiddle px-5 pt-2 pb-5">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-Outline">
              all careers total
            </span>
            <div className="flex items-center gap-1.5">
              <PersonIcon className="size-5" />
              <span className="text-sm font-medium">
                {totalSelectedStudents}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-Outline">session</span>
            <div className="flex h-5 w-38.75 items-center gap-1">
              <button
                aria-label="Decrease sessions"
                className="grid h-full w-7.75 place-items-center rounded bg-Primary text-OnPrimary"
                onClick={() =>
                  onSessionCountChange(Math.max(0, sessionCount - 1))
                }
                type="button"
              >
                −
              </button>
              <output className="grid h-full min-w-0 flex-1 place-items-center rounded border border-OnSurface text-xs font-medium">
                {sessionCount}
              </output>
              <button
                aria-label="Increase sessions"
                className="grid h-full w-7.75 place-items-center rounded bg-Primary text-OnPrimary"
                onClick={() => onSessionCountChange(sessionCount + 1)}
                type="button"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </footer>
    </aside>
  );
}
