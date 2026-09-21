"use client";

import type { StudentClassItem } from "@/features/student/types";
import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export type PrerequisiteEdge = {
  prerequisiteId: string;
  courseId: string;
};

export type StudentDiagramSelection = {
  highlightedIds: ReadonlySet<string>;
  edges: readonly PrerequisiteEdge[];
};

export type StudentDiagramCardPresentation = {
  dimmed: boolean;
  filterHidden: boolean;
  interactive: boolean;
};

type PointerDocument = {
  addEventListener: (
    type: "pointerdown",
    listener: EventListener,
    options?: AddEventListenerOptions | boolean,
  ) => void;
  removeEventListener: (
    type: "pointerdown",
    listener: EventListener,
    options?: EventListenerOptions | boolean,
  ) => void;
};

type AttributeTarget = EventTarget & {
  hasAttribute?: (name: string) => boolean;
};

const EMPTY_SELECTION: StudentDiagramSelection = {
  highlightedIds: new Set(),
  edges: [],
};

export function buildStudentDiagramSelection(
  selectedId: string | null,
  items: readonly StudentClassItem[],
): StudentDiagramSelection {
  if (!selectedId) return EMPTY_SELECTION;

  const itemsById = new Map(items.map((item) => [item.id, item]));
  const selectedItem = itemsById.get(selectedId);
  if (!selectedItem) return EMPTY_SELECTION;

  const highlightedIds = new Set<string>();
  const expandedIds = new Set<string>();
  const edgeKeys = new Set<string>();
  const edges: PrerequisiteEdge[] = [];
  const pending: StudentClassItem[] = [selectedItem];

  while (pending.length > 0) {
    const item = pending.pop();
    if (!item || expandedIds.has(item.id)) continue;

    expandedIds.add(item.id);
    highlightedIds.add(item.id);

    for (const prerequisite of item.preRequisites ?? []) {
      highlightedIds.add(prerequisite.id);

      const edgeKey = `${prerequisite.id}\u0000${item.id}`;
      if (!edgeKeys.has(edgeKey)) {
        edgeKeys.add(edgeKey);
        edges.push({
          prerequisiteId: prerequisite.id,
          courseId: item.id,
        });
      }

      pending.push(itemsById.get(prerequisite.id) ?? prerequisite);
    }
  }

  return { highlightedIds, edges };
}

export function toggleStudentDiagramSelection(
  selectedId: string | null,
  itemId: string,
) {
  return selectedId === itemId ? null : itemId;
}

export function getVisiblePrerequisiteEdges(
  edges: readonly PrerequisiteEdge[],
  visibleItemIds: ReadonlySet<string>,
) {
  return edges.filter(
    (edge) =>
      visibleItemIds.has(edge.prerequisiteId) &&
      visibleItemIds.has(edge.courseId),
  );
}

export function getStudentDiagramCardPresentation(
  selectedId: string | null,
  highlightedIds: ReadonlySet<string>,
  itemId: string,
  matchesFilter: boolean,
): StudentDiagramCardPresentation {
  const hasSelection = selectedId !== null;

  return {
    dimmed: hasSelection && !highlightedIds.has(itemId),
    filterHidden: !hasSelection && !matchesFilter,
    interactive: matchesFilter,
  };
}

function isMarkedDiagramCard(target: EventTarget) {
  return (
    typeof (target as AttributeTarget).hasAttribute === "function" &&
    (target as AttributeTarget).hasAttribute?.("data-student-diagram-card") ===
      true
  );
}

export function isPointerOnCardInDiagram(
  event: Pick<Event, "composedPath">,
  diagramRoot: EventTarget,
) {
  const path = event.composedPath();
  return path.includes(diagramRoot) && path.some(isMarkedDiagramCard);
}

export function subscribeToStudentDiagramOutsidePointer(
  pointerDocument: PointerDocument | undefined,
  diagramRoot: EventTarget | null,
  clearSelection: () => void,
) {
  if (!pointerDocument || !diagramRoot) return () => undefined;

  const handlePointerDown: EventListener = (event) => {
    if (!isPointerOnCardInDiagram(event, diagramRoot)) {
      clearSelection();
    }
  };
  const listenerOptions = { capture: true };

  pointerDocument.addEventListener(
    "pointerdown",
    handlePointerDown,
    listenerOptions,
  );

  return () => {
    pointerDocument.removeEventListener(
      "pointerdown",
      handlePointerDown,
      listenerOptions,
    );
  };
}

export function useClearStudentDiagramSelectionOnOutsidePointer(
  selectedId: string | null,
  diagramRootRef: RefObject<HTMLDivElement | null>,
  clearSelection: () => void,
) {
  useEffect(() => {
    if (!selectedId) return;

    return subscribeToStudentDiagramOutsidePointer(
      typeof document === "undefined" ? undefined : document,
      diagramRootRef.current,
      clearSelection,
    );
  }, [clearSelection, diagramRootRef, selectedId]);
}

export function useStudentDiagramSelection(
  items: readonly StudentClassItem[],
) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selection = useMemo(
    () => buildStudentDiagramSelection(selectedId, items),
    [items, selectedId],
  );
  const toggleSelection = useCallback((itemId: string) => {
    setSelectedId((current) =>
      toggleStudentDiagramSelection(current, itemId),
    );
  }, []);
  const clearSelection = useCallback(() => setSelectedId(null), []);

  return {
    selectedId,
    toggleSelection,
    clearSelection,
    ...selection,
  };
}
