import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { DataSearchRootProvider } from "@/shared/store/filter/FilterProvider";

import OfferingCourseShellContainer from "./OfferingCourseShellContainer";

const OFFERING_COURSES: NonNullable<
  ComponentProps<typeof OfferingCourseShellContainer>["offeringCourses"]
> = [
  {
    id: "offering-mat-101",
    courseKey: "MAT101",
    sessionNumber: 1,
    estimatedNumber: 30,
    course: {
      key: "MAT101",
      keyCode: "MAT",
      keyNumber: "101",
      name: "Matemáticas",
      hours: 6,
      credits: 6,
      block: "A",
      recommendedSemesters: [1],
    },
  },
  {
    id: "offering-fis-201",
    courseKey: "FIS201",
    sessionNumber: 1,
    estimatedNumber: 24,
    course: {
      key: "FIS201",
      keyCode: "FIS",
      keyNumber: "201",
      name: "Física",
      hours: 4,
      credits: 5,
      block: "B",
      recommendedSemesters: [2],
    },
  },
];

type ContainerProps = ComponentProps<typeof OfferingCourseShellContainer>;

function SelectionHarness(props: ContainerProps) {
  const [selectedCourseKey, setSelectedCourseKey] = useState<string | null>(null);

  return (
    <OfferingCourseShellContainer
      {...props}
      selectedCourseKey={selectedCourseKey}
      onCourseClick={(courseKey) => {
        setSelectedCourseKey((current) =>
          current === courseKey ? null : courseKey,
        );
      }}
    />
  );
}

function EmptyHarness() {
  const [renderCount, setRenderCount] = useState(1);

  return (
    <>
      <button type="button" onClick={() => setRenderCount((count) => count + 1)}>
        Parent render {renderCount}
      </button>
      <OfferingCourseShellContainer career="TIND" period="2026-1" />
    </>
  );
}

const meta = {
  title: "Features/ScheduleBuilder/OfferingCourseShellContainer",
  component: OfferingCourseShellContainer,
  parameters: {
    layout: "centered",
  },
  args: {
    career: "TIND",
    period: "2026-1",
    offeringCourses: OFFERING_COURSES,
  },
  render: (args) => (
    <DataSearchRootProvider>
      <SelectionHarness {...args} />
    </DataSearchRootProvider>
  ),
} satisfies Meta<typeof OfferingCourseShellContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatefulInteractions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mathCard = canvas.getByText("Matemáticas").closest("[data-isselected]");

    if (!mathCard) throw new Error("The Matemáticas course card was not rendered");

    await userEvent.click(mathCard);
    await expect(
      canvas.getByText("Matemáticas").closest("[data-isselected]"),
    ).toHaveAttribute("data-isselected", "true");

    await userEvent.type(canvas.getByRole("searchbox"), "mate");
    await expect(canvas.getByText("Matemáticas")).toBeVisible();
    await expect(canvas.queryByText("Física")).not.toBeInTheDocument();

    const filteredMathCard = canvas
      .getByText("Matemáticas")
      .closest("[data-isselected]");
    if (!filteredMathCard) throw new Error("The filtered course card was not rendered");

    await userEvent.click(filteredMathCard);
    await expect(
      canvas.getByText("Matemáticas").closest("[data-isselected]"),
    ).toHaveAttribute("data-isselected", "false");
  },
};

export const EmptyDefaultRemainsStable: Story = {
  render: () => (
    <DataSearchRootProvider>
      <EmptyHarness />
    </DataSearchRootProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("No offering courses found.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Parent render 1" }));
    await expect(
      canvas.getByRole("button", { name: "Parent render 2" }),
    ).toBeVisible();
    await expect(canvas.getByText("No offering courses found.")).toBeVisible();
  },
};
