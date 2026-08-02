import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import NavigationItem from "./NavigationItem";
import { IconName, Icons } from "./icon";

const meta = {
  title: "Components/NavigationItem",
  component: NavigationItem,
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  argTypes: {
    icon: {
      control: {
        type: "select",
        options: Object.keys(Icons) as IconName[],
      },
    },
    className: { table: { disable: true } },
    label: { control: "text" },
    selected: { control: "boolean" },
    tone: { control: "inline-radio", options: ["content", "root"] },
    hasLabel: { control: "boolean" },
  },
  args: {
    icon: "twoPersons",
    label: "Alumnos",
    selected: false,
    tone: "root",
    hasLabel: true,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentSelected: Story = {
  args: {
    selected: true,
  },
};

export const RootSelected: Story = {
  args: {
    selected: true,
    tone: "root",
  },
};

export const ContentDefault: Story = {};

export const RootDefault: Story = {
  args: {
    tone: "root",
  },
};

export const IconOnly: Story = {
  args: {
    hasLabel: false,
    selected: true,
    label: "",
  },
};
