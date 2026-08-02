import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import SearchResultItem from "./SearchResultItem";

const meta = {
  title: "Components/Search/SearchResultItem",
  component: SearchResultItem,
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
  argTypes: {
    label: { control: "text" },
    active: { control: "boolean" },
    className: { table: { disable: true } },
    type: { table: { disable: true } },
    onClick: { action: "clicked" },
  },
  args: {
    label: "Arquitectura de computadoras y la nube",
    active: false,
    onClick: fn(),
  },
  tags: ["autodocs"],
  render: (args) => (
    <div className="w-80">
      <SearchResultItem {...args} />
    </div>
  ),
} satisfies Meta<typeof SearchResultItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    active: true,
  },
};

export const LongLabel: Story = {
  args: {
    label: "Arquitectura de computadoras y la nube en entornos empresariales complejos",
  },
};

export const Interactive: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Arquitectura de computadoras y la nube" }),
    );
    await expect(args.onClick).toHaveBeenCalled();
  },
};