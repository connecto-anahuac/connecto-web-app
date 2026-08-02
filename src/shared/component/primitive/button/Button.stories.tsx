import { IconName, Icons } from "../icon";
import {
  uiAppearances,
  uiComponentSizes,
  uiIntents,
} from "@/shared/lib/cva";

import Button from "./Button";
import { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Components/Button/Button",
  component: Button,
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  argTypes: {
    label: { control: "text" },
    icon: {
      control: {
        type: "select",
      },
      options: Object.keys(Icons) as IconName[],
    },
    intent: {
      control: {
        type: "select",
      },
      options: uiIntents,
    },
    size: {
      control: {
        type: "select",
      },
      options: uiComponentSizes,
    },
    appearance: {
      control: {
        type: "select",
      },
      options: uiAppearances,
    },
    hasBadge: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
  args: {
    label: "Editar",
    icon: "edit",
    intent: "primary",
    size: "md",
    appearance: "filled",
    hasBadge: false,
    disabled: false,
    loading: false,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
