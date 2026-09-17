import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import ScheduleCardContextMenu from "./ScheduleCardContextMenu";

const virtualAnchor = {
  getBoundingClientRect: () => new DOMRect(120, 80, 1, 1),
};

const meta = {
  title: "Features/ScheduleBuilder/ScheduleCardContextMenu",
  component: ScheduleCardContextMenu,
  args: {
    anchor: virtualAnchor,
    open: true,
    onDelete: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof ScheduleCardContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DeleteAction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Eliminar del horario" }));
    await expect(args.onDelete).toHaveBeenCalledTimes(1);
  },
};
