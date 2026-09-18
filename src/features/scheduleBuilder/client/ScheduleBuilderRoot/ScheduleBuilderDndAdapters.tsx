"use client";

/* eslint-disable react-hooks/refs -- dnd-kit exposes reactive callback refs and sensor state. */

import {
  useDraggable,
  useDroppable,
  type Data,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  cloneElement,
  type PropsWithChildren,
  type ReactElement,
} from "react";

import type { ScheduleClassCardProps } from "../../component/ClassCard";
import type { ScheduleCellId } from "../../types";
import type { ScheduleCellLayout } from "../scheduleBuilderCanvas/ScheduleBuilderCanvasPresenter";
import {
  courseDragId,
  occurrenceDragId,
  scheduleCellDropId,
  OFFERING_COURSE_DROP_ID,
} from "./scheduleBuilderDnd";

type OfferingCourseDraggableProps = {
  courseKey: string;
  disabled: boolean;
  card: ReactElement<ScheduleClassCardProps>;
};

export function OfferingCourseDraggable({
  courseKey,
  disabled,
  card,
}: OfferingCourseDraggableProps) {
  const draggable = useDraggable({
    id: courseDragId(courseKey),
    disabled,
    data: { kind: "course", courseKey, preview: card } satisfies Data,
  });
  return (
    <div
      ref={draggable.setNodeRef}
      data-dnd-course-key={courseKey}
    >
      {cloneElement(card, {
        ...draggable.attributes,
        ...draggable.listeners,
      })}
    </div>
  );
}

export function OfferingCourseDropZone({ children }: PropsWithChildren) {
  const droppable = useDroppable({
    id: OFFERING_COURSE_DROP_ID,
    data: { kind: "offering-course-list" } satisfies Data,
  });
  return (
    <div
      ref={droppable.setNodeRef}
      data-offering-drop-over={droppable.isOver || undefined}
      className="h-full shrink-0"
    >
      {children}
    </div>
  );
}

type ScheduleCellDroppableProps = PropsWithChildren<{
  cellId: ScheduleCellId;
  occurrenceIds: readonly string[];
  layout: ScheduleCellLayout;
}>;

const CELL_GRID_COLUMNS = ["grid-cols-1", "grid-cols-2", "grid-cols-3"] as const;

export function ScheduleCellDroppable({
  cellId,
  occurrenceIds,
  layout,
  children,
}: ScheduleCellDroppableProps) {
  const droppable = useDroppable({
    id: scheduleCellDropId(cellId),
    data: { kind: "cell", cellId } satisfies Data,
  });
  return (
    <div
      ref={droppable.setNodeRef}
      className={`col-span-full grid min-h-24 content-stretch gap-2 ${CELL_GRID_COLUMNS[layout.columnCount - 1]}`}
      data-cell-drop-over={droppable.isOver || undefined}
    >
      <SortableContext
        items={occurrenceIds.map(occurrenceDragId)}
        strategy={rectSortingStrategy}
      >
        {children}
      </SortableContext>
    </div>
  );
}

type ScheduleOccurrenceSortableProps = {
  occurrenceId: string;
  cellId: ScheduleCellId;
  card: ReactElement<ScheduleClassCardProps>;
};

export function ScheduleOccurrenceSortable({
  occurrenceId,
  cellId,
  card,
}: ScheduleOccurrenceSortableProps) {
  const sortable = useSortable({
    id: occurrenceDragId(occurrenceId),
    data: { kind: "occurrence", occurrenceId, cellId, preview: card } satisfies Data,
  });
  return (
    <div
      ref={sortable.setNodeRef}
      data-sortable-occurrence-id={occurrenceId}
      style={{
        transform: CSS.Translate.toString(sortable.transform),
        transition: sortable.transition,
      }}
    >
      {cloneElement(card, {
        ...sortable.attributes,
        ...sortable.listeners,
      })}
    </div>
  );
}
