import type { StudentClassItem } from "@/features/student/types";
import { describe, expect, it, vi } from "vitest";

import {
  buildStudentDiagramSelection,
  getStudentDiagramCardPresentation,
  getVisiblePrerequisiteEdges,
  isPointerOnCardInDiagram,
  subscribeToStudentDiagramOutsidePointer,
  toggleStudentDiagramSelection,
} from "./useStudentDiagramSelection";

describe("buildStudentDiagramSelection", () => {
  it("collects the complete prerequisite chain as direct edges", () => {
    const foundation = studentClass("foundation");
    const intermediate = studentClass("intermediate", [foundation]);
    const selected = studentClass("selected", [intermediate]);

    const result = buildStudentDiagramSelection("selected", [
      foundation,
      intermediate,
      selected,
      studentClass("unrelated"),
    ]);

    expect([...result.highlightedIds]).toEqual([
      "selected",
      "intermediate",
      "foundation",
    ]);
    expect(result.edges).toEqual([
      { prerequisiteId: "intermediate", courseId: "selected" },
      { prerequisiteId: "foundation", courseId: "intermediate" },
    ]);
  });

  it("deduplicates branching edges and terminates when prerequisites cycle", () => {
    const foundation = studentClass("foundation");
    const left = studentClass("left", [foundation, foundation]);
    const right = studentClass("right", [foundation]);
    const selected = studentClass("selected", [left, right]);
    foundation.preRequisites = [selected];

    const result = buildStudentDiagramSelection("selected", [
      foundation,
      left,
      right,
      selected,
    ]);

    expect(result.highlightedIds).toEqual(
      new Set(["selected", "left", "right", "foundation"]),
    );
    expect(result.edges).toHaveLength(5);
    expect(result.edges).toContainEqual({
      prerequisiteId: "foundation",
      courseId: "left",
    });
    expect(result.edges).toContainEqual({
      prerequisiteId: "selected",
      courseId: "foundation",
    });
  });

  it("returns no selection for a course outside the diagram", () => {
    expect(buildStudentDiagramSelection("missing", [studentClass("a")])).toEqual(
      {
        highlightedIds: new Set(),
        edges: [],
      },
    );
  });
});

describe("student diagram selection helpers", () => {
  it("clears a selected course when it is toggled again", () => {
    expect(toggleStudentDiagramSelection(null, "course")).toBe("course");
    expect(toggleStudentDiagramSelection("course", "course")).toBeNull();
    expect(toggleStudentDiagramSelection("first", "second")).toBe("second");
  });

  it("omits lines with hidden or missing endpoints", () => {
    const edges = [
      { prerequisiteId: "a", courseId: "b" },
      { prerequisiteId: "b", courseId: "c" },
      { prerequisiteId: "missing", courseId: "c" },
    ];

    expect(getVisiblePrerequisiteEdges(edges, new Set(["a", "b"]))).toEqual([
      { prerequisiteId: "a", courseId: "b" },
    ]);
  });

  it("gives prerequisite highlighting precedence over filter opacity", () => {
    const highlightedIds = new Set(["selected", "prerequisite"]);

    expect(
      getStudentDiagramCardPresentation(
        "selected",
        highlightedIds,
        "prerequisite",
        false,
      ),
    ).toEqual({ dimmed: false, filterHidden: false, interactive: false });
    expect(
      getStudentDiagramCardPresentation(
        "selected",
        highlightedIds,
        "unrelated",
        true,
      ),
    ).toEqual({ dimmed: true, filterHidden: false, interactive: true });
    expect(
      getStudentDiagramCardPresentation(null, new Set(), "filtered", false),
    ).toEqual({ dimmed: false, filterHidden: true, interactive: false });
  });

  it("recognizes only cards belonging to the current diagram instance", () => {
    const currentRoot = eventTarget();
    const otherRoot = eventTarget();
    const currentCard = eventTarget(true);
    const otherCard = eventTarget(true);

    expect(
      isPointerOnCardInDiagram(pointerEvent(currentCard, currentRoot), currentRoot),
    ).toBe(true);
    expect(
      isPointerOnCardInDiagram(pointerEvent(otherCard, otherRoot), currentRoot),
    ).toBe(false);
    expect(
      isPointerOnCardInDiagram(pointerEvent(eventTarget(), currentRoot), currentRoot),
    ).toBe(false);
  });

  it("clears on diagram whitespace and document outside pointerdown", () => {
    const root = eventTarget();
    const card = eventTarget(true);
    const pointerDocument = fakePointerDocument();
    const clearSelection = vi.fn();
    const unsubscribe = subscribeToStudentDiagramOutsidePointer(
      pointerDocument,
      root,
      clearSelection,
    );

    pointerDocument.fire(pointerEvent(card, root));
    expect(clearSelection).not.toHaveBeenCalled();

    pointerDocument.fire(pointerEvent(eventTarget(), root));
    pointerDocument.fire(pointerEvent(eventTarget()));
    expect(clearSelection).toHaveBeenCalledTimes(2);

    unsubscribe();
    expect(pointerDocument.removeEventListener).toHaveBeenCalledWith(
      "pointerdown",
      expect.any(Function),
      { capture: true },
    );
  });

  it("does not subscribe without a document or mounted diagram root", () => {
    const clearSelection = vi.fn();

    subscribeToStudentDiagramOutsidePointer(undefined, eventTarget(), clearSelection)();
    const pointerDocument = fakePointerDocument();
    subscribeToStudentDiagramOutsidePointer(pointerDocument, null, clearSelection)();

    expect(pointerDocument.addEventListener).not.toHaveBeenCalled();
    expect(clearSelection).not.toHaveBeenCalled();
  });
});

function eventTarget(isCard = false) {
  return {
    hasAttribute: (name: string) =>
      isCard && name === "data-student-diagram-card",
  } as unknown as EventTarget;
}

function pointerEvent(...path: EventTarget[]) {
  return { composedPath: () => path };
}

function fakePointerDocument() {
  let listener: EventListener | undefined;
  const addEventListener = vi.fn(
    (_type: "pointerdown", nextListener: EventListener) => {
      listener = nextListener;
    },
  );
  const removeEventListener = vi.fn(
    (_type: "pointerdown", removedListener: EventListener) => {
      if (listener === removedListener) listener = undefined;
    },
  );

  return {
    addEventListener,
    removeEventListener,
    fire: (event: Pick<Event, "composedPath">) =>
      listener?.(event as Event),
  };
}

function studentClass(
  id: string,
  preRequisites: StudentClassItem[] = [],
): StudentClassItem {
  return {
    id,
    keyCode: "TIND",
    keyNumber: id,
    name: id,
    hours: 1,
    credits: 1,
    block: "",
    preRequisites,
    period: null,
    grade: null,
    semester: 1,
    position: 0,
    status: "enrollable",
  };
}
