import { IconName, Icons } from "../icon";
import {
  uiAppearances,
  uiComponentSizes,
  uiIntents,
} from "@/shared/lib/cva";

import { Meta, StoryObj } from "@storybook/nextjs-vite";
import IconButton from "./IconButton";
import { iconbuttonIntents } from "./iconbutton_cva";

const meta = {
  title: "Components/Button/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  argTypes: {
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
      options: iconbuttonIntents,
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
    icon: "threePointMenu",
    intent: "darkInk",
    size: "lg",
    appearance: "text",
    hasBadge: false,
    disabled: false,
    loading: false,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
