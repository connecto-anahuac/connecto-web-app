"use client";

import type { ComponentProps, MouseEvent } from "react";
import { Icons } from "@/shared/component/primitive/icon";
import { cn } from "@/shared/lib/util";

export type ScheduleAssignmentCourse = {
  code: string;
  number: string | number;
  name: string;
  credits: number;
  hours: number;
  semester: string;
  students: number;
};

export type ScheduleAssignmentWarningCode =
  | "professor_unassigned"
  | "professor_not_capable"
  | "professor_unavailable"
  | "professor_conflict"
  | "classroom_unassigned"
  | "classroom_not_found"
  | "classroom_conflict"
  | "recommended_semester_conflict";

export type ScheduleAssignmentOccurrence = {
  id: string;
  label: string;
  day: string;
  timeSlotId: string;
  timeLabel: string;
  classroomId: string;
  warningCodes: ScheduleAssignmentWarningCode[];
};

export type ScheduleAssignmentSession = {
  id: string;
  label: string;
  professorName: string | null;
  capacity: number;
  requiredOccurrenceCount: number;
  occurrences: ScheduleAssignmentOccurrence[];
};

export type ScheduleAssignmentPlanCount = {
  label: string;
  count: number;
};

export type ScheduleAssignmentOption = { label: string; value: string };

export type ScheduleAssignmentPanelProps = ComponentProps<"aside"> & {
  course: ScheduleAssignmentCourse;
  dayOptions: ScheduleAssignmentOption[];
  timeSlotOptions: ScheduleAssignmentOption[];
  classroomOptions: ScheduleAssignmentOption[];
  planCounts?: ScheduleAssignmentPlanCount[];
  selectedSessionId: string;
  sessions: ScheduleAssignmentSession[];
  onCapacityChange: (capacity: number) => void;
  onClose?: () => void;
  onProfessorClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onOccurrenceDayChange: (occurrenceId: string, day: string) => void;
  onOccurrenceTimeSlotChange: (occurrenceId: string, timeSlotId: string) => void;
  onOccurrenceClassroomChange: (occurrenceId: string, classroomId: string) => void;
  onSessionSelect: (sessionId: string) => void;
};

export const SCHEDULE_ASSIGNMENT_WARNING_MESSAGES: Record<ScheduleAssignmentWarningCode, string> = {
  professor_unassigned: "Profesor sin asignar",
  professor_not_capable: "El profesor no está habilitado para esta asignatura",
  professor_unavailable: "El profesor no está disponible en este horario",
  professor_conflict: "El profesor tiene otra clase en este horario",
  classroom_unassigned: "Aula sin asignar",
  classroom_not_found: "El aula asignada no existe",
  classroom_conflict: "El aula tiene otra clase en este horario",
  recommended_semester_conflict: "Otra clase del semestre recomendado ocupa este horario",
};

function WarningMark() {
  return (
    <span
      aria-hidden="true"
      className="grid size-4.5 shrink-0 rotate-45 place-items-center rounded-xs border border-Warning bg-Warning text-[11px] font-black text-OnSurfaceVariant"
    >
      <span className="-rotate-45">!</span>
    </span>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-5", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6.5V12L15.5 14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

type FieldSelectProps = {
  ariaLabel: string;
  children: React.ReactNode;
  onChange: (value: string) => void;
  value: string;
};

function FieldSelect({ ariaLabel, children, onChange, value }: FieldSelectProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <select
        aria-label={ariaLabel}
        className="h-5 w-full appearance-none truncate rounded bg-SurfaceContainerLowest py-0 pr-7 pl-2 text-xs text-OnSurface focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-Primary"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 grid w-5 place-items-center border-l border-DividerLowest text-xs text-OnSurface"
      >
        ⌄
      </span>
    </div>
  );
}

type ScheduleCardProps = {
  classroomOptions: ScheduleAssignmentOption[];
  dayOptions: ScheduleAssignmentOption[];
  occurrence: ScheduleAssignmentOccurrence;
  onClassroomChange: (value: string) => void;
  onDayChange: (value: string) => void;
  onTimeSlotChange: (value: string) => void;
  timeSlotOptions: ScheduleAssignmentOption[];
};

export function ScheduleOccurrenceCard({
  classroomOptions,
  dayOptions,
  occurrence,
  onClassroomChange,
  onDayChange,
  onTimeSlotChange,
  timeSlotOptions,
}: ScheduleCardProps) {
  return (
    <fieldset className="min-w-0 rounded-md bg-DividerLowest p-3">
      <legend className="sr-only">{occurrence.label}</legend>
      <div className="flex min-w-0 items-center gap-2.5">
        <Icons.schedule className="size-5 shrink-0 text-OnSurfaceVariant" />
        <FieldSelect
          ariaLabel={`${occurrence.label} día`}
          onChange={onDayChange}
          value={occurrence.day}
        >
          {[{ label: occurrence.day, value: occurrence.day }, ...dayOptions]
            .filter((option, index, options) => options.findIndex(({ value }) => value === option.value) === index)
            .map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </FieldSelect>
      </div>
      <div className="mt-3 flex min-w-0 items-center gap-2.5">
        <ClockIcon className="shrink-0 text-OnSurfaceVariant" />
        <FieldSelect
          ariaLabel={`${occurrence.label} horario`}
          onChange={onTimeSlotChange}
          value={occurrence.timeSlotId}
        >
          {[{ label: occurrence.timeLabel, value: occurrence.timeSlotId }, ...timeSlotOptions]
            .filter((item, index, options) => options.findIndex(({ value }) => value === item.value) === index)
            .map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </FieldSelect>
      </div>
      <div aria-hidden="true" className="my-3 h-px bg-DividerMiddle" />
      <div className="flex min-w-0 items-center gap-2.5">
        <Icons.door className="size-5 shrink-0 text-OnSurfaceVariant" />
        <FieldSelect
          ariaLabel={`${occurrence.label} salón`}
          onChange={onClassroomChange}
          value={occurrence.classroomId}
        >
          {[{ label: occurrence.classroomId, value: occurrence.classroomId }, ...classroomOptions]
            .filter((option, index, options) => options.findIndex(({ value }) => value === option.value) === index)
            .map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </FieldSelect>
      </div>
      {occurrence.warningCodes.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-OnSurfaceVariant" aria-label={`Advertencias de ${occurrence.label}`}>
          {occurrence.warningCodes.map((code) => (
            <li className="flex gap-2" key={code}><WarningMark />{SCHEDULE_ASSIGNMENT_WARNING_MESSAGES[code]}</li>
          ))}
        </ul>
      )}
    </fieldset>
  );
}

/** Stateless schedule-assignment panel matching the narrow Figma drawer. */
export default function ScheduleAssignmentPanel({
  className,
  classroomOptions,
  course,
  dayOptions,
  onCapacityChange,
  onClose,
  onProfessorClick,
  onOccurrenceClassroomChange,
  onOccurrenceDayChange,
  onOccurrenceTimeSlotChange,
  onSessionSelect,
  planCounts = [],
  selectedSessionId,
  sessions,
  timeSlotOptions,
  ...props
}: ScheduleAssignmentPanelProps) {
  const selectedSession = sessions.find(({ id }) => id === selectedSessionId);
  const warningCodes = [...new Set(selectedSession?.occurrences.flatMap(({ warningCodes }) => warningCodes) ?? [])];

  return (
    <aside
      aria-label={`Asignación de horario de ${course.name}`}
      className={cn(
        "flex h-[1006px] max-h-full w-72 max-w-full flex-col overflow-hidden rounded-lg border border-DividerMiddle bg-SurfaceContainerLowest text-OnSurface shadow-[-4px_0_8.2px_rgb(0_0_0_/_0.12)]",
        className,
      )}
      {...props}
    >
      <header className="flex h-10 shrink-0 items-start justify-between p-2">
        <Icons.panelToLeft aria-hidden="true" className="size-4 text-OnSurface" />
        <button
          aria-label="Cerrar panel de asignación"
          className="grid size-6 place-items-center rounded text-OnSurface hover:bg-DividerLow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary"
          onClick={onClose}
          type="button"
        >
          <Icons.close aria-hidden="true" className="size-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <section className="px-5 py-2.5" aria-labelledby="assignment-course-name">
          <div className="flex min-w-0 items-center gap-6">
            <div className="flex shrink-0 overflow-hidden rounded-md border border-[var(--CMP-strong)] text-xs">
              <span className="bg-[var(--CMP-strong)] px-1 text-OnPrimary">{course.code}</span>
              <span className="px-1 text-OnSurface">{course.number}</span>
            </div>
            <p className="truncate text-xs text-OnSurfaceVariant">
              {course.credits} créd. <span aria-hidden="true">|</span> {course.hours} Hrs.
            </p>
          </div>
          <h2 id="assignment-course-name" className="mt-1.5 truncate text-xs font-medium">
            {course.name}
          </h2>
          <div className="mt-1.5 flex min-w-max items-center gap-6 text-xs">
            <span className="flex items-center gap-1 font-medium">
              <Icons.person aria-hidden="true" className="size-4" /> {course.students}
            </span>
            <span><strong className="font-medium">{course.semester}</strong> <span className="text-OnSurfaceVariant">semestre</span></span>
            <span><strong className="font-medium">{selectedSession?.requiredOccurrenceCount ?? 0}</strong><span className="text-OnSurfaceVariant">x/semana</span></span>
          </div>
        </section>

        <div className="px-5 pt-2.5">
          <div aria-label="Sesiones" className="flex gap-1 overflow-x-auto border-b border-DividerMiddle pb-2.5" role="tablist" tabIndex={0}>
            {sessions.map((session) => {
              const selected = session.id === selectedSessionId;
              return (
                <button
                  aria-selected={selected}
                  className={cn(
                    "shrink-0 rounded-sm px-2 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-Primary",
                    selected ? "bg-DividerLow text-OnSurface" : "text-OnSurfaceVariant hover:bg-DividerLowest",
                  )}
                  key={session.id}
                  onClick={() => onSessionSelect(session.id)}
                  role="tab"
                  type="button"
                >
                  {session.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-5 py-3">
          <section aria-labelledby="professor-assignment-heading">
            <div className="flex items-center gap-2.5">
              <h3 id="professor-assignment-heading" className="text-xs font-medium">profesor asignado</h3>
              {selectedSession?.professorName === null && <WarningMark />}
            </div>
            <button
              className="mt-3 flex w-full items-center gap-1 rounded-md p-2 text-left text-xs font-medium hover:bg-DividerLowest focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-Primary"
              onClick={onProfessorClick}
              type="button"
            >
              <Icons.professor aria-hidden="true" className="size-5 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{selectedSession?.professorName ?? "asignar profesor"}</span>
              <Icons.plus aria-hidden="true" className="size-5 shrink-0" />
            </button>
          </section>

          <div aria-hidden="true" className="my-3 h-px bg-DividerMiddle" />

          <section aria-labelledby="schedule-assignment-heading">
            <div className="mb-3 flex items-center gap-2.5">
              <h3 id="schedule-assignment-heading" className="text-xs font-medium">schedule asignado</h3>
              {warningCodes.length > 0 && <WarningMark />}
            </div>
            <div className="space-y-3">
              {selectedSession?.occurrences.map((occurrence) => (
                <ScheduleOccurrenceCard
                  classroomOptions={classroomOptions}
                  dayOptions={dayOptions}
                  key={occurrence.id}
                  occurrence={occurrence}
                  onClassroomChange={(value) => onOccurrenceClassroomChange(occurrence.id, value)}
                  onDayChange={(value) => onOccurrenceDayChange(occurrence.id, value)}
                  onTimeSlotChange={(value) => onOccurrenceTimeSlotChange(occurrence.id, value)}
                  timeSlotOptions={timeSlotOptions}
                />
              ))}
            </div>
          </section>

          <div aria-hidden="true" className="my-3 h-px bg-DividerMiddle" />

          <section aria-labelledby="capacity-heading">
            <h3 id="capacity-heading" className="text-xs font-medium">Capacidad</h3>
            <p className="mt-3 text-xs font-medium text-OnSurfaceVariant">alumnos previstos totales</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium">
              <Icons.person aria-hidden="true" className="size-5" />
              {course.students} <span className="text-xs text-OnSurfaceVariant">alumnos</span>
            </p>
            {planCounts.length > 0 && (
              <div
                aria-label="Alumnos previstos por plan"
                className="mt-3 flex gap-4 overflow-x-auto pb-1 text-xs font-medium text-OnSurfaceVariant"
                tabIndex={0}
              >
                {planCounts.map((plan) => (
                  <span className="flex shrink-0 items-center gap-0.5" key={plan.label}>
                    {plan.label}: <Icons.person aria-hidden="true" className="size-3.5" /> {plan.count}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs font-medium text-OnSurfaceVariant">
              capacidad de {selectedSession?.label ?? "sesión"}
            </p>
            <div className="mt-2 flex h-6 min-w-0 gap-1">
              <button
                aria-label="Disminuir capacidad"
                className="grid w-14 shrink-0 place-items-center rounded-sm bg-Primary text-OnPrimary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-Primary"
                disabled={!selectedSession || selectedSession.capacity <= 0}
                onClick={() => selectedSession && onCapacityChange(Math.max(0, selectedSession.capacity - 1))}
                type="button"
              >
                <Icons.minus aria-hidden="true" className="size-4" />
              </button>
              <output aria-label="Capacidad de la sesión" className="grid min-w-0 flex-1 place-items-center rounded-sm border border-OnSurface text-sm font-medium">
                {selectedSession?.capacity ?? "--"}
              </output>
              <button
                aria-label="Aumentar capacidad"
                className="grid w-14 shrink-0 place-items-center rounded-sm bg-Primary text-OnPrimary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-Primary"
                onClick={() => selectedSession && onCapacityChange(selectedSession.capacity + 1)}
                type="button"
              >
                <Icons.plus aria-hidden="true" className="size-4" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}

export { ScheduleAssignmentPanel };
