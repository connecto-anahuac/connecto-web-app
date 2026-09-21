import { describe, expect, it } from "vitest";
import {
  createScheduleBuilderStore,
  type OfferingCourseDraft,
} from "./scheduleBuilderStore";

const draft = (studentIds = ["student-1"]) => ({
  enabledStudentIdsByStudyPlan: { planA: studentIds },
  sessionNumber: 2,
});

describe("Schedule Builder state", () => {
  it("hydrates one career only and removes duplicated enabled IDs", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("ISC", "202660");

    store.getState().hydrate("ISC", "202660", [
      { courseKey: "A", draft: draft(["student-1", "student-1"]) },
      { courseKey: "B" },
    ]);
    store
      .getState()
      .hydrate("OTHER", "202660", [
        { courseKey: "unexpected", draft: draft() },
      ]);

    expect(store.getState().selectedCourseKeys).toEqual(["A", "B"]);
    expect(store.getState().drafts.A.enabledStudentIdsByStudyPlan).toEqual({
      planA: ["student-1"],
    });
    expect(store.getState().selectedCourseKeys).not.toContain("unexpected");
  });

  it("keeps enabled IDs and the session for the selected offering in one state", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("ISC", "202660");
    store
      .getState()
      .hydrate("ISC", "202660", [{ courseKey: "A", draft: draft() }]);
    store.getState().openCourse("A");

    store.getState().setSelectedStudentIds("planA", "student-2", true);
    store.getState().setSelectedStudentIds("planA", "student-1", false);
    store.getState().setSessionNumber(-4);

    expect(store.getState().drafts.A).toEqual({
      enabledStudentIdsByStudyPlan: { planA: ["student-2"] },
      sessionNumber: 0,
    });
  });

  it("tracks offering changes and resets all selection state when scope changes", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("ISC", "202660");
    store
      .getState()
      .hydrate("ISC", "202660", [{ courseKey: "A", draft: draft() }]);
    store.getState().markUnoffered("A");
    store.getState().markOffered("C");
    store.getState().startPending("C");
    store.getState().finishPending("C");
    store.getState().setSemesterEnabled("A", "planA", "8", false);
    store.getState().resetForScope("TICS", "202710");

    expect(store.getState()).toMatchObject({
      career: "TICS",
      period: "202710",
      drafts: {},
      hydrated: false,
      pendingCourseKeys: [],
      selectedCourseKeys: [],
      selectedStudyPlanId: null,
      semesterEnabledByCourse: {},
    });
  });

  it("keeps semester enabled state across panel, course, and plan changes", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("ISC", "202660");
    store.getState().setSemesterEnabled("A", "planA", "8", false);
    store.getState().setSemesterEnabled("A", "planB", "6", true);
    store.getState().openCourse("A");
    store.getState().closePanel();
    store.getState().openCourse("B");
    store.getState().setSelectedStudyPlanId("planB");

    expect(store.getState().semesterEnabledByCourse).toEqual({
      A: {
        planA: { "8": false },
        planB: { "6": true },
      },
    });
  });

  it("publishes UI draft changes with a previous value for persistence rollback", async () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("ISC", "202660");
    store
      .getState()
      .hydrate("ISC", "202660", [{ courseKey: "A", draft: draft() }]);
    store.getState().openCourse("A");
    let change:
      | { next: OfferingCourseDraft; previous: OfferingCourseDraft }
      | undefined;
    store.getState().setDraftChangeHandler((_courseKey, next, previous) => {
      change = { next, previous };
      // This mirrors the hook's IndexedDB failure recovery.
      store.getState().setDraft("A", previous);
    });

    store.getState().setSessionNumber(3);
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(change).toEqual({
      next: { enabledStudentIdsByStudyPlan: { planA: ["student-1"] }, sessionNumber: 3 },
      previous: draft(),
    });
    expect(store.getState().drafts.A).toEqual(draft());
  });

  it("does not publish a stale UI change after unoffering or changing scope", async () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("ISC", "202660");
    store
      .getState()
      .hydrate("ISC", "202660", [{ courseKey: "A", draft: draft() }]);
    store.getState().openCourse("A");
    let persistedChanges = 0;
    store.getState().setDraftChangeHandler(() => {
      persistedChanges += 1;
    });

    store.getState().setSessionNumber(3);
    store.getState().markUnoffered("A");
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    store.getState().markOffered("A");
    store.getState().setSessionNumber(4);
    store.getState().resetForScope("TICS", "202710");
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(persistedChanges).toBe(0);
  });

  it("resets selection state when only the period changes", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("ISC", "202660");
    store
      .getState()
      .hydrate("ISC", "202660", [{ courseKey: "A", draft: draft() }]);
    store.getState().openCourse("A");

    store.getState().resetForScope("ISC", "202710");

    expect(store.getState()).toMatchObject({
      career: "ISC",
      period: "202710",
      drafts: {},
      hydrated: false,
      isPanelOpen: false,
      selectedCourseKey: null,
      selectedCourseKeys: [],
    });
  });

  it("rejects delayed hydration from a stale period", () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("ISC", "202710");

    store
      .getState()
      .hydrate("ISC", "202660", [
        { courseKey: "stale", draft: draft() },
      ]);

    expect(store.getState()).toMatchObject({
      period: "202710",
      drafts: {},
      hydrated: false,
      selectedCourseKeys: [],
    });
  });

  it("does not publish a queued draft change after switching periods", async () => {
    const store = createScheduleBuilderStore();
    store.getState().resetForScope("ISC", "202660");
    store
      .getState()
      .hydrate("ISC", "202660", [{ courseKey: "A", draft: draft() }]);
    store.getState().openCourse("A");
    let persistedChanges = 0;
    store.getState().setDraftChangeHandler(() => {
      persistedChanges += 1;
    });

    store.getState().setSessionNumber(3);
    store.getState().resetForScope("ISC", "202710");
    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(persistedChanges).toBe(0);
  });
});
