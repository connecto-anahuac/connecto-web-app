import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import SearchInlineChip from "./SearchInlineChip";

const meta = {
  title: "Components/Chip/SearchInlineChip",
  component: SearchInlineChip,
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
  argTypes: {
    label: { control: "text" },
    removeLabel: { control: "text" },
    onRemove: { action: "removed" },
    className: { table: { disable: true } },
  },
  args: {
    label: "Introduction to Programming",
    removeLabel: "Remove Introduction to Programming",
    onRemove: fn(),
  },
  tags: ["autodocs"],
  render: (args) => (
    <div className="w-72">
      <SearchInlineChip {...args} />
    </div>
  ),
} satisfies Meta<typeof SearchInlineChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomRemoveLabel: Story = {
  args: {
    removeLabel: "Clear selected course",
  },
};

export const LongLabel: Story = {
  args: {
    label: "Advanced Topics in Environmental Systems Engineering and Applied Analysis",
    removeLabel:
      "Remove Advanced Topics in Environmental Systems Engineering and Applied Analysis",
  },
};

export const Interactive: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: args.removeLabel,
    });

    await userEvent.click(button);
    await expect(args.onRemove).toHaveBeenCalled();
  },
};