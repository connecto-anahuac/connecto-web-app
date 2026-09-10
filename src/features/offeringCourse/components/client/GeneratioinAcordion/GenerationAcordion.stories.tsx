import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import GenerationAcordion from "./GenerationAcordion";

const students = [
  { fullName: "Ana Sofía Martínez", id: "ana" },
  { fullName: "Rayan Garcia Reyes", id: "rayan" },
];

const meta = {
  title: "Features/OfferingCourse/GenerationAcordion",
  component: GenerationAcordion,
  args: {
    expectedStudents: students,
    isMulti: true,
    onStudentSelectionChange: () => undefined,
    selectedStudentIds: ["ana"],
    semesterLabel: "Semestre 8",
    studentsWithoutPrerequisites: [
      { fullName: "Daniel Torres", id: "daniel" },
    ],
  },
  render: function InteractiveAccordion(args) {
    const [selectedStudentIds, setSelectedStudentIds] = useState(["ana"]);
    return (
      <GenerationAcordion
        {...args}
        onStudentSelectionChange={(studentId, isSelected) =>
          setSelectedStudentIds((current) =>
            isSelected
              ? [...new Set([...current, studentId])]
              : current.filter((id) => id !== studentId),
          )
        }
        selectedStudentIds={selectedStudentIds}
      />
    );
  },
} satisfies Meta<typeof GenerationAcordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MixedSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Expand semester Semestre 8" }),
    );
    await expect(canvas.getByText("Sin prerrequisitos")).toBeVisible();
    await userEvent.dblClick(canvas.getByText("Semestre 8"));
    const switches = canvas.getAllByRole("switch");
    await expect(switches[0]).toHaveAttribute("aria-checked", "true");
    await expect(switches[1]).toHaveAttribute("aria-checked", "true");
  },
};
