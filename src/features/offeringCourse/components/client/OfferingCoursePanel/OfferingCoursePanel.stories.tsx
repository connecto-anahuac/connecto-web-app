import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import OfferingCoursePanel from "./OfferingCoursePanel";

const generations = [
  { id: "semester-12", semesterLabel: "Semestre 12", studentCount: 1 },
  { id: "semester-10", semesterLabel: "Semestre 10", studentCount: 3 },
  {
    id: "semester-8",
    semesterLabel: "Semestre 8",
    studentCount: 10,
    expectedStudents: [
      { id: "student-1", fullName: "Rayan Garcia Reyes", avatarColor: "var(--CUL-strong)", isSelected: true },
      { id: "student-2", fullName: "Ana Sofía Martínez", avatarColor: "var(--ADM-strong)", isSelected: false },
    ],
    studentsWithoutPrerequisites: [
      { id: "student-3", fullName: "Daniel Torres", avatarColor: "var(--SIS-strong)" },
    ],
  },
  { id: "semester-6", semesterLabel: "Semestre 6", studentCount: 2 },
];

const meta = {
  title: "Features/OfferingCourse/OfferingCoursePanel",
  component: OfferingCoursePanel,
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  argTypes: {
    courseName: { control: "text" },
    estimatedStudentCount: { control: { type: "number", min: 0 } },
    generations: { control: "object" },
    initialSessionCount: { control: { type: "number", min: 0 } },
    studyPlans: { control: "object" },
    selectedProgram: { control: "text" },
    totalLabel: { control: "text" },
    className: { table: { disable: true } },
    onClose: { action: "close" },
    onGenerationSelectionChange: { action: "generation selection changed" },
    onSessionCountChange: { action: "session count changed" },
  },
  args: {
    courseName: "Arquitectura de computadoras",
    estimatedStudentCount: 47,
    generations,
    initialSessionCount: 1,
    onClose: fn(),
    onGenerationSelectionChange: fn(),
    onSessionCountChange: fn(),
    studyPlans: ["TIND", "Industrial", "Civil", "Ambiental"],
    totalLabel: "estimado total",
  },
  tags: ["autodocs"],
  render: (args) => (
    <div className="h-150 max-w-[calc(100vw-2rem)]">
      <OfferingCoursePanel {...args} />
    </div>
  ),
} satisfies Meta<typeof OfferingCoursePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyGenerations: Story = {
  args: {
    generations: [],
    estimatedStudentCount: 0,
  },
};

export const LongCourseName: Story = {
  args: {
    courseName: "Arquitectura de computadoras y sistemas distribuidos empresariales",
    studyPlans: ["Tecnologías de la Información", "Ingeniería Industrial", "Ingeniería Civil"],
  },
};

export const Interactive: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Industrial" }));
    await expect(canvas.getByText("Industrial total")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Increase sessions" }));
    await expect(args.onSessionCountChange).toHaveBeenCalledWith(2);

    await userEvent.click(canvas.getByRole("button", { name: "Select Ana Sofía Martínez" }));
    await expect(args.onGenerationSelectionChange).toHaveBeenCalledWith("semester-8", "student-2", true);

    await userEvent.click(canvas.getByRole("button", { name: "Close offering course panel" }));
    await expect(args.onClose).toHaveBeenCalled();
  },
};
