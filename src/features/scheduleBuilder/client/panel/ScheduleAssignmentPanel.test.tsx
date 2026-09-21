import { renderToStaticMarkup } from "react-dom/server";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import ScheduleAssignmentPanel, {
  ScheduleOccurrenceCard,
  type ScheduleAssignmentPanelProps,
} from "./ScheduleAssignmentPanel";

describe("ScheduleAssignmentPanel", () => {
  it("renders every session tab and only the selected session occurrences", () => {
    const markup = renderToStaticMarkup(<ScheduleAssignmentPanel {...props} />);

    expect(markup).toContain("sesión 1");
    expect(markup).toContain("sesión 2");
    expect(markup).toContain("sesión 3");
    expect(markup).toContain("clase semanal 1");
    expect(markup).toContain("clase semanal 2");
    expect(markup).not.toContain("clase de otra sesión");
  });

  it("keeps invalid controlled values visible and translates warning codes", () => {
    const markup = renderToStaticMarkup(<ScheduleAssignmentPanel {...props} />);

    expect(markup).toContain('value="invalid-slot" selected=""');
    expect(markup).toContain("Horario inválido");
    expect(markup).toContain("El profesor no está disponible en este horario");
    expect(markup).toContain("El salon asignada no existe");
    expect(markup).toContain(">15<");
  });

  it("forwards each controlled occurrence edit immediately", () => {
    const onDayChange = vi.fn();
    const onTimeSlotChange = vi.fn();
    const onClassroomChange = vi.fn();
    const card = ScheduleOccurrenceCard({
      occurrence: props.sessions[0].occurrences[0],
      dayOptions: props.dayOptions,
      timeSlotOptions: props.timeSlotOptions,
      classroomOptions: props.classroomOptions,
      onDayChange,
      onTimeSlotChange,
      onClassroomChange,
    });

    changeSelect(card, "clase semanal 1 día", "monday");
    changeSelect(card, "clase semanal 1 horario", "T1");
    changeSelect(card, "clase semanal 1 salón", "room-1");

    expect(onDayChange).toHaveBeenCalledWith("monday");
    expect(onTimeSlotChange).toHaveBeenCalledWith("T1");
    expect(onClassroomChange).toHaveBeenCalledWith("room-1");
  });

  it("hides absent plan data and disables capacity decrease at zero", () => {
    const zeroCapacityProps: ScheduleAssignmentPanelProps = {
      ...props,
      sessions: props.sessions.map((session) =>
        session.id === props.selectedSessionId ? { ...session, capacity: 0 } : session),
    };
    const markup = renderToStaticMarkup(<ScheduleAssignmentPanel {...zeroCapacityProps} />);

    expect(markup).not.toContain("Alumnos previstos por plan");
    expect(markup).toContain('aria-label="Disminuir capacidad"');
    expect(markup).toContain('aria-label="Disminuir capacidad" class="grid w-14 shrink-0 place-items-center rounded-sm bg-Primary text-OnPrimary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-Primary" disabled=""');
  });
});

function changeSelect(tree: ReactNode, ariaLabel: string, value: string) {
  const select = findElement(tree, (element) =>
    element.type === "select" && element.props["aria-label"] === ariaLabel);
  expect(select).toBeDefined();
  const onChange = select?.props.onChange as ((event: { target: { value: string } }) => void) | undefined;
  onChange?.({ target: { value } });
}

function findElement(
  tree: ReactNode,
  predicate: (element: ReactElement<Record<string, unknown>>) => boolean,
): ReactElement<Record<string, unknown>> | undefined {
  if (!isValidElement<Record<string, unknown>>(tree)) return undefined;
  if (predicate(tree)) return tree;
  if (typeof tree.type === "function") {
    const renderFunction = tree.type as (componentProps: Record<string, unknown>) => ReactNode;
    return findElement(renderFunction(tree.props), predicate);
  }
  for (const child of Children.toArray(tree.props.children as ReactNode)) {
    const match = findElement(child, predicate);
    if (match) return match;
  }
  return undefined;
}

const props: ScheduleAssignmentPanelProps = {
  course: { code: "MAT", number: "101", name: "Matemáticas", credits: 6, hours: 3, semester: "1ro", students: 30 },
  selectedSessionId: "session-1",
  sessions: [
    {
      id: "session-1", label: "sesión 1", professorName: "Ana Pérez", capacity: 15, requiredOccurrenceCount: 2,
      occurrences: [
        { id: "occurrence-1", label: "clase semanal 1", day: "monday", timeSlotId: "T1", timeLabel: "T1 08:00-09:30", classroomId: "room-1", warningCodes: ["professor_unavailable"] },
        { id: "occurrence-2", label: "clase semanal 2", day: "invalid-day", timeSlotId: "invalid-slot", timeLabel: "Horario inválido", classroomId: "missing-room", warningCodes: ["classroom_not_found"] },
      ],
    },
    { id: "session-2", label: "sesión 2", professorName: null, capacity: 15, requiredOccurrenceCount: 1, occurrences: [{ id: "other", label: "clase de otra sesión", day: "tuesday", timeSlotId: "T2", timeLabel: "T2", classroomId: "room-1", warningCodes: [] }] },
    { id: "session-3", label: "sesión 3", professorName: null, capacity: 15, requiredOccurrenceCount: 1, occurrences: [] },
  ],
  dayOptions: [{ label: "Lunes", value: "monday" }],
  timeSlotOptions: [{ label: "T1 08:00-09:30", value: "T1" }],
  classroomOptions: [{ label: "Salon 1", value: "room-1" }],
  onCapacityChange: vi.fn(),
  onProfessorClick: vi.fn(),
  onOccurrenceDayChange: vi.fn(),
  onOccurrenceTimeSlotChange: vi.fn(),
  onOccurrenceClassroomChange: vi.fn(),
  onSessionSelect: vi.fn(),
};
