import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import EstimatedStudentNumberToggle from "./EstimatedStudentNumberToggle";

const meta = {
  title: "Components/EstimatedStudentNumberToggle",
  component: EstimatedStudentNumberToggle,
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  argTypes: {
    value: { control: "text" },
    isSelected: { control: "boolean" },
    isEnabled: { control: "boolean" },
    onToggle: { action: "toggled" },
    className: { table: { disable: true } },
  },
  args: {
    value: "12",
    isSelected: false,
    isEnabled: true,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EstimatedStudentNumberToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { isSelected: true },
};

export const Disabled: Story = {
  args: { isEnabled: false },
};
