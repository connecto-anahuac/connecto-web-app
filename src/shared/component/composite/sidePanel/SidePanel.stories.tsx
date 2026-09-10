"use client";

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import SidePanel, { useSidePanel, type SidePanelMode, type SidePanelSide } from "./SidePanel";

type ExampleProps = {
  mode?: SidePanelMode;
  side?: SidePanelSide;
};

function Controls() {
  const { close, open } = useSidePanel();

  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => open({ id: "student-1", type: "student" })}>Open student</button>
      <button type="button" onClick={() => open({ id: "course-1", type: "course" })}>Open course</button>
      <button type="button" onClick={close}>Close</button>
    </div>
  );
}

function Example({ mode = "overlay", side = "right" }: ExampleProps) {
  const [panel, setPanel] = useState<{ id: string; type: string } | null>(null);

  return (
    <SidePanel.Root className="h-48 border" mode={mode} onPanelChange={setPanel} panel={panel} side={side}>
      <SidePanel.Main className="p-4">
        <Controls />
      </SidePanel.Main>
      <SidePanel.Viewport aria-label="Details" className="w-48 bg-white p-4 shadow-lg">
        <SidePanel.Content type="student">{(value) => <div>Student: {value.id}</div>}</SidePanel.Content>
        <SidePanel.Content type="course">{(value) => <div>Course: {value.id}</div>}</SidePanel.Content>
      </SidePanel.Viewport>
    </SidePanel.Root>
  );
}

const meta = {
  title: "Shared/Composite/SidePanel",
  component: Example,
  args: { mode: "overlay", side: "right" },
  tags: ["autodocs"],
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overlay: Story = {};

export const PushFromLeft: Story = {
  args: { mode: "push", side: "left" },
};

export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Open student" }));
    await expect(canvas.getByLabelText("Details")).toHaveTextContent("Student: student-1");

    await userEvent.click(canvas.getByRole("button", { name: "Open course" }));
    await expect(canvas.getByLabelText("Details")).toHaveTextContent("Course: course-1");

    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByLabelText("Details")).not.toBeInTheDocument();
  },
};
