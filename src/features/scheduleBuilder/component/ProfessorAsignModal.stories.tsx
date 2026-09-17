import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import ProfessorAsignModal from "./ProfessorAsignModal";

const meta = {
  title: "Features/ScheduleBuilder/ProfessorAsignModal",
  component: ProfessorAsignModal,
  args: {
    searchValue: "",
    professors: [
      { id: "ana", fullName: "Ana Pérez", assignedHours: 6, totalHours: 15, active: true, courseCapable: true, disabledReasons: [] },
      { id: "luis", fullName: "Luis Gómez", assignedHours: 9, totalHours: 15, active: true, courseCapable: true, disabledReasons: ["Conflicto en clase semanal 2"] },
      { id: "inactive", fullName: "Profesor inactivo", assignedHours: 0, totalHours: 15, active: false, courseCapable: true, disabledReasons: [] },
      { id: "incapable", fullName: "Sin capacidad", assignedHours: 0, totalHours: 15, active: true, courseCapable: false, disabledReasons: [] },
    ],
    onSearchValueChange: fn(),
    onProfessorSelect: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof ProfessorAsignModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Candidates: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: /Ana Pérez/ })).toBeEnabled();
    await expect(canvas.getByRole("button", { name: /Luis Gómez/ })).toBeDisabled();
    await expect(canvas.getByText("Conflicto en clase semanal 2")).toBeVisible();
    await expect(canvas.queryByText("Profesor inactivo")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /Ana Pérez/ }));
    await expect(args.onProfessorSelect).toHaveBeenCalledWith(args.professors[0]);
    await userEvent.type(canvas.getByRole("searchbox", { name: "Buscar profesores" }), "ana");
    await expect(args.onSearchValueChange).toHaveBeenCalled();
  },
};
