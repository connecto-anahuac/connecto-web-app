"use client";

import type { ComponentProps } from "react";
import { useState } from "react";

import GenerationAcordion from "@/features/offeringCourse/components/client/GeneratioinAcordion/GenerationAcordion";
import CloseIcon from "@/shared/component/primitive/icon/CloseIcon";
import PanelToLeftIcon from "@/shared/component/primitive/icon/PanelToLeftIcon";
import PersonIcon from "@/shared/component/primitive/icon/PersonIcon";
import { cn } from "@/shared/lib/util";

type Student = {
  avatarColor?: string;
  fullName: string;
  id: string;
  isSelected?: boolean;
};

type Generation = {
  expectedStudents?: Student[];
  id: string;
  isSelected?: boolean;
  semesterLabel: string;
  studentCount: number;
  studentsWithoutPrerequisites?: Student[];
};

type Props = ComponentProps<"aside"> & {
  courseName?: string;
  estimatedStudentCount?: number;
  generations?: Generation[];
  initialSessionCount?: number;
  onClose?: () => void;
  onGenerationSelectionChange?: (
    generationId: string,
    studentId: string,
    isSelected: boolean,
  ) => void;
  onSessionCountChange?: (sessionCount: number) => void;
  studyPlans?: string[];
  selectedProgram?: string;
  totalLabel?: string;
};

const defaultGenerations: Generation[] = [
  { id: "semester-12", semesterLabel: "Semestre 12", studentCount: 1 },
  { id: "semester-10", semesterLabel: "Semestre 10", studentCount: 3 },
  {
    id: "semester-8",
    semesterLabel: "Semestre 8",
    studentCount: 10,
    expectedStudents: [
      { id: "student-1", fullName: "Rayan Garcia Reyes", avatarColor: "var(--CUL-strong)", isSelected: true },
      { id: "student-2", fullName: "Rayan Garcia Reyes", avatarColor: "var(--ADM-strong)", isSelected: false },
      { id: "student-3", fullName: "Rayan Garcia Reyes", avatarColor: "var(--CMP-strong)", isSelected: true },
    ],
    studentsWithoutPrerequisites: [
      { id: "student-4", fullName: "Rayan Garcia Reyes", avatarColor: "var(--ADM-strong)" },
      { id: "student-5", fullName: "Rayan Garcia Reyes", avatarColor: "var(--SIS-strong)" },
    ],
  },
  { id: "semester-6", semesterLabel: "Semestre 6", studentCount: 2 },
  { id: "semester-4", semesterLabel: "Semestre 4", studentCount: 12 },
];

/** The course offering side panel. Its scrollable body is composed of generation accordions. */
export default function OfferingCoursePanel({
  className,
  courseName = "Arquitectura de computadoras",
  estimatedStudentCount = 47,
  generations = defaultGenerations,
  initialSessionCount = 1,
  onClose,
  onGenerationSelectionChange,
  onSessionCountChange,
   studyPlans = ["TIND", "Industrial", "Civil", "Ambiental"],
  selectedProgram: selectedProgramProp,
  totalLabel = "estimado total",
  ...props
}: Props) {
  const [selectedProgram, setSelectedProgram] = useState(selectedProgramProp ?? studyPlans[0]);
  const [sessionCount, setSessionCount] = useState(initialSessionCount);

  const updateSessionCount = (nextValue: number) => {
    const value = Math.max(0, nextValue);
    setSessionCount(value);
    onSessionCountChange?.(value);
  };

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
        <PanelToLeftIcon aria-hidden="true" className="size-4 shrink-0 text-OnSurface" />
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

      <div className="px-5 pb-2.5">
        <div className="flex items-center gap-1 border-b border-DividerMiddle">
          {studyPlans.map((program) => {
            const isSelected = program === selectedProgram;
            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  "rounded px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary",
                  isSelected ? "bg-DividerLow text-OnSurface" : "text-OnSurface-60 hover:bg-DividerLowest",
                )}
                key={program}
                onClick={() => setSelectedProgram(program)}
                type="button"
              >
                {program}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5">
        <div className="flex items-center justify-end gap-2 py-2 text-Outline">
          <span className="text-xs font-medium">{selectedProgram} total</span>
          <PersonIcon className="size-4" />
          <span className="text-sm font-medium">{estimatedStudentCount}</span>
        </div>

        <div className="flex flex-col gap-0">
          {generations.map((generation) => (
           <> <GenerationAcordion
              expectedStudents={generation.expectedStudents}
              key={generation.id}
              onStudentSelectionChange={(studentId, isSelected) =>
                onGenerationSelectionChange?.(generation.id, studentId, isSelected)
              }
              semesterLabel={generation.semesterLabel}
              studentCount={generation.studentCount}
              studentsWithoutPrerequisites={generation.studentsWithoutPrerequisites}
            />
            <div className="h-px w-full bg-DividerLow" aria-hidden="true" />
            </>
          ))}
        </div>
      </div>

      <footer className="border-t border-DividerMiddle px-5 pt-2 pb-5">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-Outline">{totalLabel}</span>
            <div className="flex items-center gap-1.5">
              <PersonIcon className="size-5" />
              <span className="text-sm font-medium">{estimatedStudentCount}</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-Outline">session</span>
            <div className="flex h-5 w-38.75 items-center gap-1">
              <button
                aria-label="Decrease sessions"
                className="grid h-full w-7.75 place-items-center rounded bg-Primary text-OnPrimary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary"
                onClick={() => updateSessionCount(sessionCount - 1)}
                type="button"
              >
                −
              </button>
              <output className="grid h-full min-w-0 flex-1 place-items-center rounded border border-OnSurface text-xs font-medium">
                {sessionCount}
              </output>
              <button
                aria-label="Increase sessions"
                className="grid h-full w-7.75 place-items-center rounded bg-Primary text-OnPrimary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary"
                onClick={() => updateSessionCount(sessionCount + 1)}
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
