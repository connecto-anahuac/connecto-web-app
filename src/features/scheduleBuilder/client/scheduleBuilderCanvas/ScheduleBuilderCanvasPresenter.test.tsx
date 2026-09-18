import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";
import type {
  ScheduleCellId,
  ScheduleCourseDraft,
  ScheduleWeekDay,
} from "@/features/scheduleBuilder/types";

import {
  getProfessorAvatarColor,
  getWarningLevel,
  ScheduleBuilderCanvasPresenter,
  type ScheduleCellLayout,
} from "./ScheduleBuilderCanvasPresenter";

describe("ScheduleBuilderCanvasPresenter", () => {
  it.each([
    [[], undefined],
    [["professor_unassigned"], "mid"],
    [["professor_unassigned", "classroom_unassigned"], "mid"],
    [["professor_conflict"], "high"],
    [["classroom_unassigned", "classroom_conflict"], "high"],
  ] as const)("maps conflict codes %# to %s warnings", (conflictCodes, warning) => {
    expect(getWarningLevel(conflictCodes)).toBe(warning);
  });

  it("renders seven weekdays, ten DTO time slots, and all 70 cells", () => {
    const markup = renderCanvas();

    for (const day of ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]) {
      expect(markup).toContain(day);
    }
    for (let index = 1; index <= 10; index += 1) {
      expect(markup).toContain(`T${index}`);
    }
    expect(markup).toContain("08:00");
    expect(markup).toContain("09:30");
    expect(markup.match(/data-cell-id=/g)).toHaveLength(70);
    expect(markup).toContain(
      "grid-template-columns:auto minmax(616px, 3fr) minmax(200px, 1fr)",
    );
    expect(markup).toContain("overflow-auto");
    expect(markup).toContain("position:sticky");
  });

  it("sizes each weekday from its maximum simultaneous occurrence count", () => {
    const markup = renderCanvas({
      courses: coursesWithOccurrences([
        { day: "tuesday", timeSlotId: "T1" },
        { day: "wednesday", timeSlotId: "T1" },
        { day: "wednesday", timeSlotId: "T1" },
        { day: "thursday", timeSlotId: "T1" },
        { day: "thursday", timeSlotId: "T1" },
        { day: "thursday", timeSlotId: "T1" },
        { day: "friday", timeSlotId: "T1" },
        { day: "friday", timeSlotId: "T1" },
        { day: "friday", timeSlotId: "T1" },
        { day: "friday", timeSlotId: "T1" },
      ]),
    });

    expect(markup).toContain(
      "grid-template-columns:auto minmax(200px, 1fr) minmax(408px, 2fr) "
      + "minmax(616px, 3fr) minmax(616px, 3fr) minmax(616px, 3fr) "
      + "minmax(200px, 1fr) minmax(200px, 1fr)",
    );
  });

  it("uses the same weekday width when occurrences are split across time slots", () => {
    const markup = renderCanvas({
      courses: coursesWithOccurrences([
        { day: "monday", timeSlotId: "T1" },
        { day: "monday", timeSlotId: "T2" },
        { day: "monday", timeSlotId: "T3" },
      ]),
    });

    expect(markup).toContain(
      "grid-template-columns:auto minmax(408px, 2fr) minmax(200px, 1fr)",
    );
    expect(markup).not.toContain("grid-template-columns:auto minmax(616px, 3fr)");
  });

  it("uses three columns for four occurrences and maps occurrence states", () => {
    const markup = renderCanvas({
      selectedOccurrenceId: "MAT101:1:1",
      draggingOccurrenceId: "MAT101:1:2",
    });

    expect(markup.match(/data-occurrence-id=/g)).toHaveLength(4);
    expect(markup).toContain("grid-cols-3");
    expect(markup).toContain("col-span-3");
    expect(markup.match(/min-w-\[200px\]/g)).toHaveLength(4);
    expect(markup).toContain('data-isselected="true"');
    expect(markup).toContain('data-dragging="true"');
    expect(markup).toContain('data-hasalert="true"');
    expect(markup).toContain('data-completed="true"');
  });

  it("stretches empty cells to the schedule row height", () => {
    const markup = renderCanvas();

    expect(markup.match(/content-stretch/g)).toHaveLength(70);
    expect(markup.match(/self-stretch/g)).toHaveLength(70);
    expect(markup.match(/h-auto/g)).toHaveLength(70);
  });

  it("fills every remaining grid column for zero through six occurrences", () => {
    const layouts = new Map<ScheduleCellId, ScheduleCellLayout>();

    renderCanvas({
      courses: coursesWithOccurrences([
        ...placementsForDay("tuesday", 1),
        ...placementsForDay("wednesday", 2),
        ...placementsForDay("thursday", 3),
        { day: "thursday", timeSlotId: "T2" },
        ...placementsForDay("friday", 4),
        ...placementsForDay("saturday", 5),
        ...placementsForDay("sunday", 6),
      ]),
      renderCell: (cellId, children, layout) => {
        layouts.set(cellId, layout);
        return children;
      },
    });

    expect(layouts.get("monday:T1")).toEqual({
      columnCount: 1,
      emptyCellColumnSpan: 1,
    });
    expect(layouts.get("tuesday:T1")).toEqual({
      columnCount: 2,
      emptyCellColumnSpan: 1,
    });
    expect(layouts.get("wednesday:T1")).toEqual({
      columnCount: 3,
      emptyCellColumnSpan: 1,
    });
    expect(layouts.get("thursday:T1")).toEqual({
      columnCount: 3,
      emptyCellColumnSpan: 3,
    });
    expect(layouts.get("thursday:T2")).toEqual({
      columnCount: 3,
      emptyCellColumnSpan: 2,
    });
    expect(layouts.get("friday:T1")).toEqual({
      columnCount: 3,
      emptyCellColumnSpan: 2,
    });
    expect(layouts.get("saturday:T1")).toEqual({
      columnCount: 3,
      emptyCellColumnSpan: 1,
    });
    expect(layouts.get("sunday:T1")).toEqual({
      columnCount: 3,
      emptyCellColumnSpan: 3,
    });
  });

  it("renders deterministic avatars and controlled cell states", () => {
    const color = getProfessorAvatarColor("prof-1");
    const markup = renderCanvas({
      highlightedCellIds: ["tuesday:T1"],
      invalidCellIds: ["wednesday:T1"],
      dragOverCellIds: ["thursday:T1"],
      availableProfessorAvatars: {
        "monday:T1": [{ id: "prof-1", fullName: "Ana Pérez" }],
      },
    });

    expect(getProfessorAvatarColor("prof-1")).toBe(color);
    expect(markup).toContain(`background-color:${color}`);
    expect(markup).toContain('data-cell-id="tuesday:T1" data-cell-state="highlighted"');
    expect(markup).toContain('data-cell-id="wednesday:T1" data-cell-state="invalid"');
    expect(markup).toContain('data-cell-id="thursday:T1" data-cell-state="drag-over"');
  });

  it("renders loading, error, and empty states", () => {
    expect(renderCanvas({ loading: true })).toContain('data-state="loading"');
    expect(renderCanvas({ error: "No disponible" })).toContain('role="alert"');
    expect(renderCanvas({ courses: [] })).toContain('data-state="empty"');
    expect(renderCanvas({ data: null })).toContain('data-state="empty"');
  });
});

function renderCanvas(
  overrides: Partial<Parameters<typeof ScheduleBuilderCanvasPresenter>[0]> = {},
) {
  return renderToStaticMarkup(
    <ScheduleBuilderCanvasPresenter
      data={data}
      courses={courses}
      selectedOccurrenceId={null}
      {...overrides}
    />,
  );
}

const timeSlots = Array.from({ length: 10 }, (_, index) => ({
  id: `T${index + 1}`,
  startTime: `${String(8 + index).padStart(2, "0")}:00`,
  endTime: `${String(9 + index).padStart(2, "0")}:30`,
  position: index + 1,
}));

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
  timeSlots,
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
    occurrences: Array.from({ length: 4 }, (_, index) => ({
      id: `MAT101:1:${index + 1}`,
      courseKey: "MAT101",
      sessionNumber: 1,
      occurrenceNumber: index + 1,
      day: "monday" as const,
      timeSlotId: "T1",
      classroomId: "room-1",
      position: index,
      conflictCodes: index === 0 ? ["professor_conflict" as const] : [],
    })),
  }],
}];

function coursesWithOccurrences(
  placements: readonly { day: ScheduleWeekDay; timeSlotId: string }[],
): ScheduleCourseDraft[] {
  return [{
    ...courses[0],
    sessions: [{
      ...courses[0].sessions[0],
      requiredOccurrenceCount: placements.length,
      occurrences: placements.map(({ day, timeSlotId }, index) => ({
        ...courses[0].sessions[0].occurrences[0],
        id: `MAT101:1:${index + 1}`,
        occurrenceNumber: index + 1,
        day,
        timeSlotId,
        position: index,
        conflictCodes: [],
      })),
    }],
  }];
}

function placementsForDay(
  day: ScheduleWeekDay,
  occurrenceCount: number,
): { day: ScheduleWeekDay; timeSlotId: string }[] {
  return Array.from({ length: occurrenceCount }, () => ({ day, timeSlotId: "T1" }));
}
