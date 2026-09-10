import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { IconName, Icons } from "@/shared/component/primitive/icon";
import { InformationLine } from "./InformationLine";


const meta = {
  title: "Components/ProfileSummary/InformationLine",
  component: InformationLine,
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    iconName: { control: "select", options: Object.keys(Icons) as IconName[] },
       
  },
  args: {
    label: "matricula",
      value: "123456",
    iconName: "hashmark",
  },
  tags: ["autodocs"],
//   render: (args) => (
//     <div className="w-72">
//       <SearchInlineChip {...args} />
//     </div>
//   ),
} satisfies Meta<typeof InformationLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NameLabel: Story = {
 args: {
    label: "Nombre",
      value: "Ryan Garcia Ximenez",
    iconName: "person",
  },
};
