import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import GenerationAcordion from "./GenerationAcordion";

const students = [
  { fullName: "Ana Sofía Martínez", id: "ana" },
  { fullName: "Rayan Garcia Reyes", id: "rayan" },
  { fullName: "Luis Pérez", id: "luis", isEligible: false },
];

const meta = {
  title: "Features/OfferingCourse/GenerationAcordion",
  component: GenerationAcordion,
  args: {
    expectedStudents: students,
    isSemesterEnabled: true,
    onSemesterEnabledChange: fn(),
    onStudentSelectionChange: fn(),
    selectedStudentIds: [],
    semesterLabel: "Semestre 8",
    studentsWithoutPrerequisites: [
      { fullName: "Daniel Torres", id: "daniel" },
    ],
  },
  render: function InteractiveAccordion(args) {
    const [isSemesterEnabled, setIsSemesterEnabled] = useState(
      args.isSemesterEnabled,
    );
    const [selectedStudentIds, setSelectedStudentIds] = useState(
      args.selectedStudentIds,
    );
    return (
      <GenerationAcordion
        {...args}
        isSemesterEnabled={isSemesterEnabled}
        onSemesterEnabledChange={(isEnabled) => {
          setIsSemesterEnabled(isEnabled);
          args.onSemesterEnabledChange(isEnabled);
        }}
        onStudentSelectionChange={(studentId, isSelected) => {
          setSelectedStudentIds((current) =>
            isSelected
              ? [...new Set([...current, studentId])]
              : current.filter((id) => id !== studentId),
          );
          args.onStudentSelectionChange(studentId, isSelected);
        }}
        selectedStudentIds={selectedStudentIds}
      />
    );
  },
} satisfies Meta<typeof GenerationAcordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnabledUnselected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const semesterToggle = canvas.getByRole("switch", {
      name: "Select Semestre 8",
    });

    await expect(semesterToggle).not.toHaveClass("justify-center");
    await expect(canvas.getByText("0")).toBeVisible();
  },
};

export const EnabledSelected: Story = {
  args: { selectedStudentIds: ["ana", "rayan"] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const semesterToggle = canvas.getByRole("switch", {
      name: "Select Semestre 8",
    });

    await expect(semesterToggle).not.toHaveClass("justify-center");
    await expect(canvas.getByText("2")).toBeVisible();
  },
};

export const DisabledUnselected: Story = {
  args: { isSemesterEnabled: false },
};

export const DisabledSelected: Story = {
  args: {
    isSemesterEnabled: false,
    selectedStudentIds: ["ana", "luis"],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Expand semester Semestre 8" }),
    );
    const semesterToggle = canvas.getByRole("switch", {
      name: "Select Semestre 8",
    });
    const selectedStudentToggle = canvas.getByRole("switch", {
      name: "Select Ana Sofía Martínez",
    });
    const unselectedStudentToggle = canvas.getByRole("switch", {
      name: "Select Rayan Garcia Reyes",
    });
    const estimatedStudentNumber = canvas.getByText("1").parentElement;

    await expect(semesterToggle).toHaveClass("justify-center");
    await expect(selectedStudentToggle).toBeDisabled();
    await expect(selectedStudentToggle).toHaveAttribute("aria-checked", "true");
    await expect(unselectedStudentToggle).toBeDisabled();
    await expect(estimatedStudentNumber).toHaveClass(
      "bg-StudentNumberContainer",
    );
    await userEvent.click(selectedStudentToggle);
    await expect(args.onStudentSelectionChange).not.toHaveBeenCalled();

    await userEvent.click(semesterToggle);
    await expect(args.onSemesterEnabledChange).toHaveBeenCalledWith(true);
    await expect(selectedStudentToggle).toBeEnabled();
    await expect(selectedStudentToggle).toHaveAttribute("aria-checked", "true");
    await expect(estimatedStudentNumber).toHaveClass("bg-PrimaryContainer");

    await userEvent.click(unselectedStudentToggle);
    await expect(args.onStudentSelectionChange).toHaveBeenCalledWith(
      "rayan",
      true,
    );
    await expect(semesterToggle).not.toHaveClass("justify-center");
    await userEvent.click(semesterToggle);
    await expect(unselectedStudentToggle).toBeDisabled();
    await expect(unselectedStudentToggle).toHaveAttribute("aria-checked", "true");
    await expect(selectedStudentToggle).toHaveAttribute("aria-checked", "true");
    await expect(semesterToggle).toHaveAttribute("aria-checked", "false");
    await expect(canvas.getByText("2").parentElement).toHaveClass(
      "bg-StudentNumberContainer",
    );
  },
};
