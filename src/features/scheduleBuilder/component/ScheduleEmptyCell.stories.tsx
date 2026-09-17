import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ScheduleEmptyCell from "./ScheduleEmptyCell";

const meta = {
  title: "Features/ScheduleBuilder/ScheduleEmptyCell",
  component: ScheduleEmptyCell,
  parameters: {
    layout: "centered",
  },
  args: {
    avatars: [
      { fullName: "Isabel Torres", color: "#009688" },
      { fullName: "Pedro Ortega", color: "#ff9800" },
      { fullName: "Ana Beltrán", color: "#8d6e63" },
      { fullName: "María Estrada", color: "#607d8b" },
      { fullName: "Sofía Sánchez", color: "#00acc1" },
      { fullName: "Diego Kim", color: "#43a047" },
      { fullName: "Carlos Ibarra", color: "#ef5350" },
      { fullName: "Julia Pérez", color: "#673ab7" },
    ],
  },
} satisfies Meta<typeof ScheduleEmptyCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutAvatars: Story = {
  args: {
    avatars: [],
  },
};

export const Highlighted: Story = {
  args: { status: "highlighted" },
};

export const Invalid: Story = {
  args: { status: "invalid" },
};

export const DragOver: Story = {
  args: { status: "drag-over" },
};
