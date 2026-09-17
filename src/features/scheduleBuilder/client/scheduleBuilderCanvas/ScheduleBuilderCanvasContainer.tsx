"use client";

import { useScheduleBuilderStore } from "../ScheduleBuilderRoot/ScheduleBuilderStoreProvider";
import {
  ScheduleBuilderCanvasPresenter,
  type ScheduleBuilderCanvasPresenterProps,
} from "./ScheduleBuilderCanvasPresenter";

type Props = Pick<
  ScheduleBuilderCanvasPresenterProps,
  | "className"
  | "highlightedCellIds"
  | "invalidCellIds"
  | "dragOverCellIds"
  | "draggingOccurrenceId"
  | "availableProfessorAvatars"
  | "onAddCourse"
  | "renderCell"
  | "renderOccurrence"
  | "onCanvasBackgroundClick"
  | "onOccurrenceContextMenu"
>;

export default function ScheduleBuilderCanvasContainer({
  onOccurrenceContextMenu,
  ...props
}: Props) {
  const state = useScheduleBuilderStore((store) => store);
  return (
    <ScheduleBuilderCanvasPresenter
      {...props}
      data={state.data}
      courses={state.courses}
      selectedOccurrenceId={state.selectedOccurrenceId}
      loading={state.isLoading}
      error={state.error}
      onOccurrenceClick={state.selectOccurrence}
      onOccurrenceContextMenu={(occurrenceId, event) => {
        event.preventDefault();
        state.openContextMenu(occurrenceId);
        onOccurrenceContextMenu?.(occurrenceId, event);
      }}
    />
  );
}
