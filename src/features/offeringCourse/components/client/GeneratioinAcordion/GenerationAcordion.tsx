"use client";

import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";

import OfferingClassStudentNameRow from "@/features/offeringCourse/components/OfferingClassStudentNameRow";
import OfferingClassStudentRow from "@/features/offeringCourse/components/OfferingClassStudentRow";
import OfferingCourseSemesterRow from "@/features/offeringCourse/components/OfferingCourseSemesterRow";
import { cn } from "@/shared/lib/util";

type Student = {
  avatarColor?: string;
  fullName: string;
  id: string;
  isSelected?: boolean;
};

type Props = ComponentProps<"div"> & {
  approvedLabel?: string;
  expectedStudents?: Student[];
  onApprovedClick?: () => void;
  onStudentSelectionChange?: (studentId: string, isSelected: boolean) => void;
  semesterLabel?: string;
  studentCount?: number;
  studentsWithoutPrerequisites?: Student[];
};

export default function GenerationAcordion({
  approvedLabel = "Mostrar todos los aprobados",
  className,
  expectedStudents = [],
  onApprovedClick,
  onStudentSelectionChange,
  semesterLabel = "Semestre 12",
  studentCount = 12,
  studentsWithoutPrerequisites = [],
  ...props
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className={cn("flex w-full flex-col", className)} {...props}>
      <OfferingCourseSemesterRow
        className="w-full"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        semesterLabel={semesterLabel}
        studentCount={studentCount}
      />

      {isOpen && (
        <div className="flex flex-col gap-2.5">
          <StudentSection label="Previstos">
            {expectedStudents.map((student) => (
              <OfferingClassStudentRow
                key={student.id}
                className="w-full"
                avatarColor={student.avatarColor}
                fullName={student.fullName}
                isSelected={student.isSelected}
                onSelectionChange={(isSelected) => onStudentSelectionChange?.(student.id, isSelected)}
              />
            ))}
          </StudentSection>

          <StudentSection label="Sin prerrequisitos">
            {studentsWithoutPrerequisites.map((student) => (
              <OfferingClassStudentNameRow
                key={student.id}
                avatarColor={student.avatarColor}
                fullName={student.fullName}
              />
            ))}
          </StudentSection>

          <StudentSection label="Aprobados">
            <button
              className="ml-1  flex w-full items-center justify-center rounded bg-DividerMiddle px-2.5 py-1 text-xs text-Outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary"
              onClick={onApprovedClick}
              type="button"
            >
              {approvedLabel}
            </button>
          </StudentSection>
        </div>
      )}
    </section>
  );
}

function StudentSection({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-2  pl-3.5">
      <p className="text-[10px] font-medium text-Outline">{label}</p>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}
