"use client";

import type { StudentClassItem } from "@/features/student/types";
import {
  buildPrerequisiteSelection,
  getDiagramCardPresentation,
  getVisiblePrerequisiteEdges,
  isPointerOnCardInDiagram,
  subscribeToDiagramOutsidePointer,
  toggleDiagramSelection,
  useClearDiagramSelectionOnOutsidePointer,
  usePrerequisiteSelection,
} from "@/shared/component/composite/diagram/prerequisiteDiagram";

export type {
  DiagramCardPresentation as StudentDiagramCardPresentation,
  PrerequisiteEdge,
  PrerequisiteSelection as StudentDiagramSelection,
} from "@/shared/component/composite/diagram/prerequisiteDiagram";

const studentPrerequisiteAdapter = {
  getId: (item: StudentClassItem) => item.id,
  getPrerequisites: (item: StudentClassItem) => item.preRequisites ?? [],
};

export function buildStudentDiagramSelection(
  selectedId: string | null,
  items: readonly StudentClassItem[],
) {
  return buildPrerequisiteSelection(
    selectedId,
    items,
    studentPrerequisiteAdapter,
  );
}

export const toggleStudentDiagramSelection = toggleDiagramSelection;
export { getVisiblePrerequisiteEdges, isPointerOnCardInDiagram };
export const getStudentDiagramCardPresentation = getDiagramCardPresentation;
export const subscribeToStudentDiagramOutsidePointer =
  subscribeToDiagramOutsidePointer;
export const useClearStudentDiagramSelectionOnOutsidePointer =
  useClearDiagramSelectionOnOutsidePointer;

export function useStudentDiagramSelection(
  items: readonly StudentClassItem[],
) {
  return usePrerequisiteSelection(items, studentPrerequisiteAdapter);
}
