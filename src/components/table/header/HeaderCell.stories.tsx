import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HeaderCell from ".";
import PersonIcon from "../../icon/PersonIcon";
import { IconName, Icons } from "../../icon";

const meta = {
  title: "Components/Table/HeaderCell",
  component: HeaderCell,
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
  argTypes: {
    label: { control: "text" },
    icon: { control: "select", options: Object.keys(Icons) as IconName[] },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    label: "Nombre",
    icon: "person",
  },
  tags: ["autodocs"],
  render: (args) => (
    <div className="w-72">
      <HeaderCell {...args} />
    </div>
  ),
} satisfies Meta<typeof HeaderCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTrailing: Story = {
  args: {
    label: "Nombre",
    icon: "person",
  },
};

export const LongLabel: Story = {
  args: {
    label: "Advanced Databases and Distributed Systems Requirements",
  },
};

export const WithCustomChildren: Story = {
  args: {
    label: "Ignored by children",
    children: (
      <span className="font-semibold text-OnSurface">
        Custom header content
      </span>
    ),
  },
};
