import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ScheduleClassCard from "./ClassCard";

const meta = {
  title: "Features/ScheduleBuilder/ScheduleClassCard",
  component: ScheduleClassCard,
  parameters: {
    layout: "centered",
  },
  args: {
    courseCode: "TIND",
    courseNumber: 402,
    hours: "6",
    title: "Arquitectura de computadoras",
    sessionNumber: 2,
    recommendedSemester: 8,
    classCount: 3,
    sessionStudents: 24,
    totalStudents: 30,
    professorName: "María Fernanda López",
    classroom: "A-204",
  },
} satisfies Meta<typeof ScheduleClassCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongCourseTitle: Story = {
  args: {
    title: "Diseño y análisis de algoritmos para sistemas distribuidos",
  },
};

export const UnscheduledOfferingCourse: Story = {
  args: {
    sessionNumber: undefined,
    classCount: undefined,
    sessionStudents: undefined,
    professorName: undefined,
    classroom: undefined,
  },
};

export const SelectedWithWarning: Story = {
  args: {
    selected: true,
    warning: true,
  },
};

export const Completed: Story = {
  args: {
    completed: true,
  },
};
