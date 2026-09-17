import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import ScheduleAssignmentPanel from "./ScheduleAssignmentPanel";

const meta = {
  title: "Features/ScheduleBuilder/ScheduleAssignmentPanel",
  component: ScheduleAssignmentPanel,
  parameters: {
    layout: "centered",
    a11y: { test: "error" },
  },
  args: {
    course: {
      code: "CMP",
      number: 2045,
      name: "Arquitectura de computadoras",
      credits: 7,
      hours: 4.5,
      semester: "3ro",
      students: 31,
    },
    selectedSessionId: "session-1",
    sessions: [
      {
        id: "session-1",
        label: "sesión 1",
        professorName: null,
        capacity: 15,
        requiredOccurrenceCount: 3,
        occurrences: [
          { id: "occurrence-1", label: "clase semanal 1", day: "wednesday", timeSlotId: "T1", timeLabel: "T1 7:00-8:30", classroomId: "room-331", warningCodes: ["professor_unassigned"] },
          { id: "occurrence-2", label: "clase semanal 2", day: "wednesday", timeSlotId: "T1", timeLabel: "T1 7:00-8:30", classroomId: "missing-room", warningCodes: ["classroom_not_found"] },
          { id: "occurrence-3", label: "clase semanal 3", day: "--", timeSlotId: "invalid-slot", timeLabel: "Horario inválido", classroomId: "", warningCodes: ["classroom_unassigned"] },
        ],
      },
      { id: "session-2", label: "sesión 2", professorName: "Ana Pérez", capacity: 20, requiredOccurrenceCount: 3, occurrences: [] },
      { id: "session-3", label: "sesión 3", professorName: null, capacity: 15, requiredOccurrenceCount: 3, occurrences: [] },
    ],
    dayOptions: [{ label: "Martes", value: "tuesday" }, { label: "Miércoles", value: "wednesday" }],
    timeSlotOptions: [{ label: "T1 7:00-8:30", value: "T1" }, { label: "T2 8:30-10:00", value: "T2" }],
    classroomOptions: [{ label: "salón 331", value: "room-331" }, { label: "salón 204", value: "room-204" }],
    planCounts: [{ label: "TIND", count: 14 }, { label: "Industrial", count: 17 }],
    onCapacityChange: fn(),
    onClose: fn(),
    onProfessorClick: fn(),
    onOccurrenceDayChange: fn(),
    onOccurrenceTimeSlotChange: fn(),
    onOccurrenceClassroomChange: fn(),
    onSessionSelect: fn(),
  },
  render: (args) => (
    <div className="h-[1006px] max-h-[calc(100vh-2rem)] w-72 max-w-[calc(100vw-2rem)]">
      <ScheduleAssignmentPanel {...args} />
    </div>
  ),
} satisfies Meta<typeof ScheduleAssignmentPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FigmaDesign: Story = {};

export const Interactive: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("tab", { name: "sesión 3" }));
    await expect(args.onSessionSelect).toHaveBeenCalledWith("session-3");

    await userEvent.click(canvas.getByRole("button", { name: "asignar profesor" }));
    await expect(args.onProfessorClick).toHaveBeenCalledTimes(1);

    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "clase semanal 1 día" }), "tuesday");
    await expect(args.onOccurrenceDayChange).toHaveBeenCalledWith("occurrence-1", "tuesday");

    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "clase semanal 1 horario" }), "T2");
    await expect(args.onOccurrenceTimeSlotChange).toHaveBeenCalledWith("occurrence-1", "T2");

    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "clase semanal 1 salón" }), "room-204");
    await expect(args.onOccurrenceClassroomChange).toHaveBeenCalledWith("occurrence-1", "room-204");

    await userEvent.click(canvas.getByRole("button", { name: "Disminuir capacidad" }));
    await userEvent.click(canvas.getByRole("button", { name: "Aumentar capacidad" }));
    await expect(args.onCapacityChange).toHaveBeenNthCalledWith(1, 14);
    await expect(args.onCapacityChange).toHaveBeenNthCalledWith(2, 16);

    await expect(canvas.getByRole("tab", { name: "sesión 3" })).toBeVisible();
    await expect(canvas.getByText("El aula asignada no existe")).toBeVisible();
    await expect(canvas.getByRole("option", { name: "Horario inválido" })).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Cerrar panel de asignación" }));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};
