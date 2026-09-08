import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import ToggleButton from "./ToggleButton";

const meta = {
  title: "Components/Primitive/ToggleButton",
  component: ToggleButton,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    isSelected: {
      control: "boolean",
      description: "Whether the switch is on.",
    },
    isMulti: {
      control: "boolean",
      description: "Uses the compact multi-select indicator.",
    },
    isEnabled: {
      control: "boolean",
      description: "Enables interaction and the enabled visual state.",
    },
    isEnable: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    isSelected: false,
    isMulti: false,
    isEnabled: true,
    "aria-label": "Example toggle",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { isSelected: true },
};

export const MultiSelect: Story = {
  args: {
    isSelected: true,
    isMulti: true,
    "aria-label": "Multi-select toggle",
  },
};

export const Disabled: Story = {
  args: {
    isEnabled: false,
    "aria-label": "Disabled toggle",
  },
};

export const DisabledSelected: Story = {
  args: {
    isSelected: true,
    isEnabled: false,
    "aria-label": "Disabled selected toggle",
  },
};

export const Interactive: Story = {
  render: function InteractiveToggle(args) {
    const [isSelected, setIsSelected] = useState(args.isSelected);

    return (
      <ToggleButton
        {...args}
        isSelected={isSelected}
        onClick={() => setIsSelected((current) => !current)}
      />
    );
  },
};
