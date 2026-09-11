import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import OfferingCoursePanel, { type OfferingCoursePanelPlan } from "./OfferingCoursePanel";
import { ScheduleBuilderStateProvider } from "../ScheduleBuilder/ScheduleBuilderStateProvider";

const plans: OfferingCoursePanelPlan[] = [
  { id: "tind", label: "TIND", recommendedSemester: 8, semesters: [{ id: "semester-8", label: "Semestre 8", semester: 8, expectedStudents: [{ id: "student-1", fullName: "Rayan Garcia Reyes", avatarColor: "var(--CUL-strong)" }, { id: "student-2", fullName: "Ana Sofía Martínez", avatarColor: "var(--ADM-strong)" }], studentsWithoutPrerequisites: [{ id: "student-3", fullName: "Daniel Torres", avatarColor: "var(--SIS-strong)" }] }] },
  { id: "industrial", label: "Industrial", recommendedSemester: 7, semesters: [{ id: "semester-6", label: "Semestre 6", semester: 6, expectedStudents: [{ id: "student-2", fullName: "Ana Sofía Martínez" }] }] },
];

const meta = { title: "Features/OfferingCourse/OfferingCoursePanel", component: OfferingCoursePanel, parameters: { layout: "centered", a11y: { test: "todo" } }, args: { courseName: "Arquitectura de computadoras", plans, enabledStudentIdsByStudyPlan: { tind: ["student-1"], industrial: ["student-2"] }, onClose: fn(), onSelectedPlanChange: fn(), onStudentEnabledChange: fn(), onSessionCountChange: fn() }, render: (args) => <ScheduleBuilderStateProvider><div className="h-150 max-w-[calc(100vw-2rem)]"><OfferingCoursePanel {...args} /></div></ScheduleBuilderStateProvider> } satisfies Meta<typeof OfferingCoursePanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Loading: Story = { args: { isLoading: true } };
export const Error: Story = { args: { errorMessage: "Eligible students could not be loaded." } };
export const Empty: Story = { args: { plans: [], enabledStudentIdsByStudyPlan: {} } };
export const Interactive: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const planTotal = canvas.getByText("TIND total").parentElement;
    const allCareersTotal = canvas.getByText("all careers total").parentElement;
    const semesterToggle = canvas.getByRole("switch", {
      name: "Select Semestre 8",
    });

    await expect(semesterToggle).toHaveAttribute("aria-checked", "true");
    await expect(within(planTotal!).getByText("1")).toBeVisible();
    await expect(within(allCareersTotal!).getByText("2")).toBeVisible();
    await userEvent.click(semesterToggle);
    await expect(semesterToggle).toHaveAttribute("aria-checked", "false");
    await expect(within(planTotal!).getByText("1")).toBeVisible();
    await expect(within(allCareersTotal!).getByText("2")).toBeVisible();

    await userEvent.click(canvas.getByRole("tab", { name: "Industrial" }));
    await expect(args.onSelectedPlanChange).toHaveBeenCalledWith("industrial");
    await expect(
      canvas.getByRole("switch", { name: "Select Semestre 6" }),
    ).toHaveAttribute("aria-checked", "false");
    await userEvent.click(canvas.getByRole("tab", { name: "TIND" }));
    await expect(
      canvas.getByRole("switch", { name: "Select Semestre 8" }),
    ).toHaveAttribute("aria-checked", "false");

    await userEvent.click(
      canvas.getByRole("button", { name: "Increase sessions" }),
    );
    await expect(args.onSessionCountChange).toHaveBeenCalledWith(2);
    await userEvent.click(
      canvas.getByRole("button", { name: "Close offering course panel" }),
    );
    await expect(args.onClose).toHaveBeenCalled();
  },
};
