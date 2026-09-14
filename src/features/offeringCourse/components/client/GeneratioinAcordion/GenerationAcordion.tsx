"use client";

import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import OfferingClassStudentNameRow from "@/features/offeringCourse/components/OfferingClassStudentNameRow";
import OfferingClassStudentRow from "@/features/offeringCourse/components/OfferingClassStudentRow";
import OfferingCourseSemesterRow from "@/features/offeringCourse/components/OfferingCourseSemesterRow";
import { cn } from "@/shared/lib/util";
import type { OfferingCoursePanelStudent } from "../OfferingCoursePanel/types";

type Props = ComponentProps<"div"> & {
  expectedStudents: OfferingCoursePanelStudent[];
  isSemesterEnabled: boolean;
  onSemesterEnabledChange: (isEnabled: boolean) => void;
  onStudentSelectionChange: (studentId: string, isSelected: boolean) => void;
  selectedStudentIds: string[];
  semesterLabel: string;
  studentsWithoutPrerequisites?: OfferingCoursePanelStudent[];
};

/** Accordion container; the caller owns all selection data. */
export default function GenerationAcordion(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <GenerationAcordionPresenter
      {...props}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    />
  );
}

type PresenterProps = Props & {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function GenerationAcordionPresenter({
  className,
  expectedStudents,
  isSemesterEnabled,
  isOpen,
  onOpenChange,
  onSemesterEnabledChange,
  onStudentSelectionChange,
  selectedStudentIds,
  semesterLabel,
  studentsWithoutPrerequisites = [],
  ...props
}: PresenterProps) {
  const selectedIds = new Set(selectedStudentIds);
  const eligibleStudents = expectedStudents.filter(
    (student) => student.isEligible !== false,
  );
  const selectedEligibleStudents = eligibleStudents.filter((student) =>
    selectedIds.has(student.id),
  );
  const hasMixedEligibleSelection =
    selectedEligibleStudents.length > 0 &&
    selectedEligibleStudents.length < eligibleStudents.length;
  return (
    <section className={cn("flex w-full flex-col", className)} {...props}>
      <OfferingCourseSemesterRow
        className="w-full"
        isMulti={hasMixedEligibleSelection}
        isOpen={isOpen}
        isSelected={isSemesterEnabled}
        onOpenChange={onOpenChange}
        onSelectionChange={onSemesterEnabledChange}
        semesterLabel={semesterLabel}
        studentCount={selectedEligibleStudents.length}
      />
      {isOpen ? (
        <div className="flex flex-col gap-2.5 pb-2">
          <StudentSection label="Previstos">
            {expectedStudents.map((student) => (
              <OfferingClassStudentRow
                avatarColor={student.avatarColor}
                fullName={student.fullName}
                isEnabled={
                  isSemesterEnabled && student.isEligible !== false
                }
                isSelected={selectedIds.has(student.id)}
                key={student.id}
                onSelectionChange={(isSelected) => {
                  if (isSemesterEnabled && student.isEligible !== false)
                    onStudentSelectionChange(student.id, isSelected);
                }}
              />
            ))}
          </StudentSection>
          {studentsWithoutPrerequisites.length > 0 ? (
            <StudentSection label="Sin prerrequisitos">
              {studentsWithoutPrerequisites.map((student) => (
                <OfferingClassStudentNameRow
                  avatarColor={student.avatarColor}
                  fullName={student.fullName}
                  key={student.id}
                />
              ))}
            </StudentSection>
          ) : null}
          {/* <StudentSection label="Aprobados">
            <button
              className="ml-1 flex w-full items-center justify-center rounded bg-DividerMiddle px-2.5 py-1 text-xs text-Outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary"
              type="button"
            >
              Mostrar todos los aprobados
            </button>
          </StudentSection> */}
        </div>
      ) : null}
    </section>
  );
}

function StudentSection({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2 pl-3.5">
      <p className="text-[10px] font-medium text-Outline">{label}</p>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}
