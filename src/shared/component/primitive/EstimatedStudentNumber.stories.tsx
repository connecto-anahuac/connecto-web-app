import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import EstimatedStudentNumber from "./EstimatedStudentNumber";

const meta = {
  title: "Components/EstimatedStudentNumber",
  component: EstimatedStudentNumber,
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  argTypes: {
    value: { control: "text" },
    isSelected: { control: "boolean" },
    className: { table: { disable: true } },
  },
  args: {
    value: "12",
    isSelected: false,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EstimatedStudentNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { isSelected: true },
};
