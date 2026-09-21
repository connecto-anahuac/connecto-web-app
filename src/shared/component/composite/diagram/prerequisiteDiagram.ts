"use client";

import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const prerequisiteDiagramCardAttribute =
  "data-prerequisite-diagram-card";

export type PrerequisiteEdge = {
  prerequisiteId: string;
  courseId: string;
};

export type PrerequisiteSelection = {
  highlightedIds: ReadonlySet<string>;
  edges: readonly PrerequisiteEdge[];
};

export type DiagramCardPresentation = {
  dimmed: boolean;
  filterHidden: boolean;
  interactive: boolean;
};

export type PrerequisiteSelectionAdapter<Item> = {
  getId: (item: Item) => string;
  getPrerequisites: (item: Item) => readonly Item[];
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

const EMPTY_SELECTION: PrerequisiteSelection = {
  highlightedIds: new Set(),
  edges: [],
};

export function buildPrerequisiteSelection<Item>(
  selectedId: string | null,
  items: readonly Item[],
  adapter: PrerequisiteSelectionAdapter<Item>,
): PrerequisiteSelection {
  if (!selectedId) return EMPTY_SELECTION;

  const itemsById = new Map(items.map((item) => [adapter.getId(item), item]));
  const selectedItem = itemsById.get(selectedId);
  if (!selectedItem) return EMPTY_SELECTION;

  const highlightedIds = new Set<string>();
  const expandedIds = new Set<string>();
  const edgeKeys = new Set<string>();
  const edges: PrerequisiteEdge[] = [];
  const pending: Item[] = [selectedItem];

  while (pending.length > 0) {
    const item = pending.pop();
    if (!item) continue;

    const itemId = adapter.getId(item);
    if (expandedIds.has(itemId)) continue;

    expandedIds.add(itemId);
    highlightedIds.add(itemId);

    for (const prerequisite of adapter.getPrerequisites(item)) {
      const prerequisiteId = adapter.getId(prerequisite);
      highlightedIds.add(prerequisiteId);

      const edgeKey = `${prerequisiteId}\u0000${itemId}`;
      if (!edgeKeys.has(edgeKey)) {
        edgeKeys.add(edgeKey);
        edges.push({ prerequisiteId, courseId: itemId });
      }

      pending.push(itemsById.get(prerequisiteId) ?? prerequisite);
    }
  }

  return { highlightedIds, edges };
}

export function toggleDiagramSelection(
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

export function getDiagramCardPresentation(
  selectedId: string | null,
  highlightedIds: ReadonlySet<string>,
  itemId: string,
  matchesFilter: boolean,
): DiagramCardPresentation {
  const hasSelection = selectedId !== null;

  return {
    dimmed: hasSelection && !highlightedIds.has(itemId),
    filterHidden: !hasSelection && !matchesFilter,
    interactive: matchesFilter,
  };
}

function isMarkedDiagramCard(target: EventTarget) {
  const hasAttribute = (target as AttributeTarget).hasAttribute;
  return (
    typeof hasAttribute === "function" &&
    (hasAttribute.call(target, prerequisiteDiagramCardAttribute) === true ||
      hasAttribute.call(target, "data-student-diagram-card") === true)
  );
}

export function isPointerOnCardInDiagram(
  event: Pick<Event, "composedPath">,
  diagramRoot: EventTarget,
) {
  const path = event.composedPath();
  return path.includes(diagramRoot) && path.some(isMarkedDiagramCard);
}

export function subscribeToDiagramOutsidePointer(
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

export function useClearDiagramSelectionOnOutsidePointer(
  selectedId: string | null,
  diagramRootRef: RefObject<HTMLDivElement | null>,
  clearSelection: () => void,
) {
  useEffect(() => {
    if (!selectedId) return;

    return subscribeToDiagramOutsidePointer(
      typeof document === "undefined" ? undefined : document,
      diagramRootRef.current,
      clearSelection,
    );
  }, [clearSelection, diagramRootRef, selectedId]);
}

export function usePrerequisiteSelection<Item>(
  items: readonly Item[],
  adapter: PrerequisiteSelectionAdapter<Item>,
) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selection = useMemo(
    () => buildPrerequisiteSelection(selectedId, items, adapter),
    [adapter, items, selectedId],
  );
  const toggleSelection = useCallback((itemId: string) => {
    setSelectedId((current) => toggleDiagramSelection(current, itemId));
  }, []);
  const clearSelection = useCallback(() => setSelectedId(null), []);

  return {
    selectedId,
    toggleSelection,
    clearSelection,
    ...selection,
  };
}
