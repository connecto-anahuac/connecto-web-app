import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import NavigationItem from "./NavigationItem";

function NavIcon() {
  return (
    <svg aria-hidden="true" className="size-4.5" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 3.25A2.55 2.55 0 1 1 9 8.35A2.55 2.55 0 0 1 9 3.25ZM4.5 13.5C4.5 11.98 5.73 10.75 7.25 10.75H10.75C12.27 10.75 13.5 11.98 13.5 13.5V14.25H4.5V13.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

const meta = {
  title: "Components/NavigationItem",
  component: NavigationItem,
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  argTypes: {
    icon: { table: { disable: true } },
    className: { table: { disable: true } },
    label: { control: "text" },
    selected: { control: "boolean" },
    tone: { control: "inline-radio", options: ["content", "root"] },
    hasLabel: { control: "boolean" },
  },
  args: {
    icon: <NavIcon />,
    label: "materias ofertadas",
    selected: false,
    tone: "content",
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