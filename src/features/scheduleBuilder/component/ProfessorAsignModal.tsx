"use client";

import type { ComponentProps } from "react";
import Avator from "@/shared/component/primitive/Avator";
import { Icons } from "@/shared/component/primitive/icon";
import { cn } from "@/shared/lib/util";

export type AssignableProfessor = {
  id: string;
  fullName: string;
  assignedHours: number;
  totalHours: number;
  color?: string;
  active: boolean;
  courseCapable: boolean;
  disabledReasons: readonly string[];
};

export type ProfessorAsignModalProps = ComponentProps<"section"> & {
  professors: readonly AssignableProfessor[];
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onProfessorSelect: (professor: AssignableProfessor) => void;
  onClose?: () => void;
};

/** A compact, filterable list for assigning a professor to a scheduled class. */
export default function ProfessorAsignModal({
  professors,
  searchValue,
  onSearchValueChange,
  onProfessorSelect,
  onClose,
  className,
  ...props
}: ProfessorAsignModalProps) {
  const normalizedQuery = searchValue.trim().toLocaleLowerCase();
  const filteredProfessors = professors.filter((professor) =>
    professor.active
    && professor.courseCapable
    && (!normalizedQuery || professor.fullName.toLocaleLowerCase().includes(normalizedQuery)));

  return (
    <section
      aria-label="Profesores"
      className={cn(
        "flex w-72 flex-col gap-2 rounded-md bg-SurfaceContainerLowest p-3 text-OnSurface outline outline-1 outline-Outline",
        className,
      )}
      {...props}
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-[3px]">
          <Icons.professor className="size-3.5" aria-hidden="true" />
          <h2 className="text-xs font-normal">Profesores</h2>
        </div>
        <button
          type="button"
          aria-label="Cerrar profesores"
          className="rounded-sm text-OnSurfaceVariant transition-colors hover:bg-SurfaceContainerHigh focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary"
          onClick={onClose}
        >
          <Icons.close className="size-3.5" aria-hidden="true" />
        </button>
      </header>

      <input
        type="search"
        aria-label="Buscar profesores"
        value={searchValue}
        onChange={(event) => onSearchValueChange(event.target.value)}
        className="h-9 w-full rounded-md bg-zinc-100 px-1.5 py-2 text-sm text-zinc-700 outline outline-1 outline-Primary placeholder:text-zinc-700 focus:outline-2"
      />

      <ul className="flex flex-col gap-1" aria-label="Profesores disponibles">
        {filteredProfessors.map((professor) => {
          const progress =
            professor.totalHours > 0
              ? Math.min((professor.assignedHours / professor.totalHours) * 100, 100)
              : 0;

          return (
            <li key={professor.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-sm p-2 text-left transition-colors enabled:hover:bg-SurfaceContainerLow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary disabled:cursor-not-allowed disabled:opacity-55"
                disabled={professor.disabledReasons.length > 0}
                onClick={() => onProfessorSelect(professor)}
              >
                <Avator
                  fullName={professor.fullName}
                  size="large"
                  color={professor.color}
                  className={!professor.color ? "bg-Primary" : undefined}
                />
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="truncate text-base font-medium text-neutral-800">
                    {professor.fullName}
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span
                      className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-2xl bg-zinc-400"
                      aria-label={`${professor.assignedHours} de ${professor.totalHours} horas asignadas`}
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={professor.totalHours}
                      aria-valuenow={professor.assignedHours}
                    >
                      <span
                        className="block h-full rounded-[45px] bg-green-600"
                        style={{ width: `${progress}%` }}
                      />
                    </span>
                    <span className="shrink-0 text-xs text-neutral-800">
                      {professor.assignedHours}/{professor.totalHours}h
                    </span>
                  </span>
                </span>
              </button>
              {professor.disabledReasons.length > 0 && (
                <ul className="space-y-0.5 px-2 pb-2 pl-14 text-xs text-OnSurfaceVariant" aria-label={`Motivos para no asignar a ${professor.fullName}`}>
                  {professor.disabledReasons.map((reason) => <li key={reason}>{reason}</li>)}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { ProfessorAsignModal };
