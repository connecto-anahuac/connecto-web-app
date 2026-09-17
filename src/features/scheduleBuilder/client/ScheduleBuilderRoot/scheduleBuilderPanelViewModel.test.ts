import { describe, expect, it } from "vitest";
import type { ScheduleBuilderDataDto } from "@/external/dto/schedule-builder";
import type { ScheduleCourseDraft } from "../../types";
import {
  createAssignableProfessors,
  createScheduleAssignmentPanelViewModel,
  createScheduleSidePanelValue,
  removeContextMenuOccurrence,
} from "./scheduleBuilderPanelViewModel";
import { createScheduleBuilderStore } from "../scheduleBuilderStore";

describe("scheduleBuilderPanelViewModel", () => {
  it("maps every session and the DTO options", () => {
    const model = createScheduleAssignmentPanelViewModel(data, courses, "C1", 2);
    expect(model?.sessions.map(({ id }) => id)).toEqual(["1", "2"]);
    expect(model?.selectedSessionId).toBe("2");
    expect(model?.dayOptions[0]).toEqual({ value: "monday", label: "Lunes" });
    expect(model?.timeSlotOptions[0]).toEqual({ value: "T1", label: "T1 · 08:00–09:30" });
    expect(model?.classroomOptions).toEqual([{ value: "R1", label: "A-101" }]);
  });

  it("derives eligible professors, conflict reasons, and deterministic hour totals", () => {
    const professors = createAssignableProfessors(data, courses, "C1", 2);
    expect(professors.map(({ id }) => id)).toEqual(["P1", "P2"]);
    expect(professors[0]).toMatchObject({
      id: "P1",
      assignedHours: 1.5,
      totalHours: 1.5,
      disabledReasons: ["El profesor no está disponible en este horario"],
    });
    expect(professors[1]?.disabledReasons).toEqual([]);
  });

  it("opens SidePanel only for a valid model and deletes the context occurrence", () => {
    const model = createScheduleAssignmentPanelViewModel(data, courses, "C1", 1);
    expect(createScheduleSidePanelValue(false, model)).toBeNull();
    expect(createScheduleSidePanelValue(true, model)).toMatchObject({ type: "assignment" });

    const store = createScheduleBuilderStore();
    store.getState().resetForScope("IT", "2026");
    store.getState().hydrate(data);
    const occurrence = store.getState().placeCourse("C1", "monday", "T1")!;
    store.getState().openContextMenu(occurrence.id);
    expect(removeContextMenuOccurrence(store.getState(), occurrence.id)).toBe(true);
    expect(store.getState().contextMenuTarget).toBeNull();
  });
});

const data: ScheduleBuilderDataDto = {
  career: "IT",
  period: "2026",
  offeringCourses: [{
    id: "O1", courseKey: "C1", sessionNumber: 2, estimatedNumber: 30,
    course: {
      key: "C1", keyCode: "MAT", keyNumber: "101", name: "Math",
      hours: 3, credits: 4, block: "A", recommendedSemesters: [2],
    },
  }],
  professors: [
    {
      id: "P1", name: "Ada", status: "active", career: "IT", courseCapabilities: ["C1"],
      availability: [{ day: "tuesday", timeSlotId: "T2", isAvailable: true }],
    },
    {
      id: "P2", name: "Grace", status: "activo", career: "IT", courseCapabilities: ["C1"],
      availability: [{ day: "monday", timeSlotId: "T1", isAvailable: true }],
    },
    {
      id: "P3", name: "Inactive", status: "inactive", career: "IT", courseCapabilities: ["C1"],
      availability: [{ day: "monday", timeSlotId: "T1", isAvailable: true }],
    },
  ],
  classrooms: [{ id: "R1", name: "A-101", place: "A", note: "", equipments: [], admin: "" }],
  timeSlots: [
    { id: "T1", startTime: "08:00", endTime: "09:30", position: 1 },
    { id: "T2", startTime: "09:30", endTime: "11:00", position: 2 },
  ],
};

const courses: ScheduleCourseDraft[] = [{
  id: "O1", courseKey: "C1", name: "Math", hours: 3, recommendedSemesters: [2],
  sessions: [
    {
      sessionNumber: 1, professorId: "P1", capacity: 15, requiredOccurrenceCount: 2,
      occurrences: [{
        id: "occ-1", courseKey: "C1", sessionNumber: 1, occurrenceNumber: 1,
        day: "tuesday", timeSlotId: "T2", classroomId: "R1", position: 0, conflictCodes: [],
      }],
    },
    {
      sessionNumber: 2, professorId: null, capacity: 15, requiredOccurrenceCount: 2,
      occurrences: [{
        id: "occ-2", courseKey: "C1", sessionNumber: 2, occurrenceNumber: 1,
        day: "monday", timeSlotId: "T1", classroomId: null, position: 0,
        conflictCodes: ["professor_unassigned", "classroom_unassigned"],
      }],
    },
  ],
}];
