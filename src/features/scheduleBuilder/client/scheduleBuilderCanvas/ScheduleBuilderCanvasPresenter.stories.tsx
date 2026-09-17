import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";
import type { ScheduleCourseDraft } from "@/features/scheduleBuilder/types";

import { ScheduleBuilderCanvasPresenter } from "./ScheduleBuilderCanvasPresenter";

const data: ScheduleBuilderDataDto = {
  career: "TIND",
  period: "2026-1",
  offeringCourses: [{
    id: "offering-1",
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
  }],
  professors: [{
    id: "prof-1",
    name: "Ana Pérez",
    status: "active",
    career: "TIND",
    courseCapabilities: ["MAT101"],
    availability: [],
  }],
  classrooms: [{
    id: "room-1",
    name: "A-101",
    place: "A",
    note: "",
    equipments: [],
    admin: "",
  }],
  timeSlots: Array.from({ length: 10 }, (_, index) => ({
    id: `T${index + 1}`,
    startTime: `${String(7 + index).padStart(2, "0")}:00`,
    endTime: `${String(8 + index).padStart(2, "0")}:30`,
    position: index + 1,
  })),
};

const courses: ScheduleCourseDraft[] = [{
  id: "offering-1",
  courseKey: "MAT101",
  name: "Matemáticas",
  hours: 6,
  recommendedSemesters: [1],
  sessions: [{
    sessionNumber: 1,
    professorId: "prof-1",
    capacity: 15,
    requiredOccurrenceCount: 4,
    occurrences: [{
      id: "MAT101:session-1:occurrence-1",
      courseKey: "MAT101",
      sessionNumber: 1,
      occurrenceNumber: 1,
      day: "monday",
      timeSlotId: "T1",
      classroomId: "room-1",
      position: 0,
      conflictCodes: [],
    }],
  }],
}];

const meta = {
  title: "Features/ScheduleBuilder/ScheduleBuilderCanvas",
  component: ScheduleBuilderCanvasPresenter,
  parameters: { layout: "fullscreen" },
  args: {
    data,
    courses,
    selectedOccurrenceId: null,
    availableProfessorAvatars: {
      "monday:T1": [{ id: "prof-1", fullName: "Ana Pérez" }],
    },
  },
} satisfies Meta<typeof ScheduleBuilderCanvasPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CellStates: Story = {
  args: {
    highlightedCellIds: ["tuesday:T1"],
    invalidCellIds: ["wednesday:T1"],
    dragOverCellIds: ["thursday:T1"],
  },
};

export const Loading: Story = { args: { loading: true } };
export const Error: Story = { args: { error: "No se pudo cargar el horario." } };
export const Empty: Story = { args: { courses: [] } };
