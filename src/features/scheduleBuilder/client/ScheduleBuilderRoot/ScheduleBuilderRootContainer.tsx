"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { VirtualElement } from "@floating-ui/react";
import {
  cloneElement,
  isValidElement,
  type ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ProfessorAsignModal from "../../component/ProfessorAsignModal";
import ScheduleCardContextMenu from "../contextMenu/ScheduleCardContextMenu";
import OfferingCourseShellContainer from "../offeringCourseShell/OfferingCourseShellContainer";
import ScheduleAssignmentPanel from "../panel/ScheduleAssignmentPanel";
import ScheduleBuilderCanvasContainer from "../scheduleBuilderCanvas/ScheduleBuilderCanvasContainer";
import { selectCompletedCourseKeys } from "../scheduleBuilderStore";
import type { ScheduleCellId, ScheduleWeekDay } from "../../types";
import Modal, {
  ModalProvider,
  type ModalHandle,
} from "@/shared/component/composite/modal/Modal";
import SidePanel from "@/shared/component/composite/sidePanel/SidePanel";
import {
  OfferingCourseDraggable,
  OfferingCourseDropZone,
  ScheduleCellDroppable,
  ScheduleOccurrenceSortable,
} from "./ScheduleBuilderDndAdapters";
import {
  applyScheduleBuilderDrop,
  parseDragSource,
  resolveDropTarget,
  type ScheduleBuilderDragSource,
} from "./scheduleBuilderDnd";
import {
  ScheduleBuilderStoreProvider,
  useScheduleBuilderStore,
} from "./ScheduleBuilderStoreProvider";
import {
  getActiveHighlightCourseKey,
  getAvailableProfessorAvatars,
} from "./scheduleBuilderViewState";
import { useScheduleBuilderScope } from "./useScheduleBuilderScope";
import {
  createAssignableProfessors,
  createScheduleAssignmentPanelViewModel,
  createScheduleSidePanelValue,
  isScheduleWeekDay,
  removeContextMenuOccurrence,
} from "./scheduleBuilderPanelViewModel";
import type { ScheduleClassCardProps } from "../../component/ClassCard";

type Props = {
  career: string;
  period: string;
};

export default function ScheduleBuilderRootContainer(props: Props) {
  return (
    <ScheduleBuilderStoreProvider key={`${props.career}:${props.period}`}>
      <ScheduleBuilderRootContent {...props} />
    </ScheduleBuilderStoreProvider>
  );
}

function ScheduleBuilderRootContent({ career, period }: Props) {
  useScheduleBuilderScope(career, period);
  const state = useScheduleBuilderStore((store) => store);
  const [activeDrag, setActiveDrag] =
    useState<ScheduleBuilderDragSource | null>(null);
  const [activeDragCard, setActiveDragCard] =
    useState<ReactElement<ScheduleClassCardProps> | null>(null);
  const [dragOverCellId, setDragOverCellId] = useState<ScheduleCellId | null>(
    null,
  );
  const [professorModalOpen, setProfessorModalOpen] = useState(false);
  const [professorSearch, setProfessorSearch] = useState("");
  const [contextAnchor, setContextAnchor] = useState<
    Element | VirtualElement | null
  >(null);
  const professorModalRef = useRef<ModalHandle>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const clearOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") state.clearSelection();
    };
    window.addEventListener("keydown", clearOnEscape);
    return () => window.removeEventListener("keydown", clearOnEscape);
  }, [state]);

  const activeCourseKey = getActiveHighlightCourseKey(
    activeDrag,
    state.selectedCourseKey,
    state.selectedOccurrenceId,
    state.courses,
  );
  const cellFeedback = useMemo(() => {
    const highlighted: ScheduleCellId[] = [];
    const invalid: ScheduleCellId[] = [];
    if (!activeCourseKey || !state.data) return { highlighted, invalid };
    for (const day of [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ] as const) {
      for (const slot of state.data.timeSlots) {
        const cellId = `${day}:${slot.id}` as ScheduleCellId;
        if (
          state.getTargetConflicts(
            activeCourseKey,
            day,
            slot.id,
            activeDrag?.kind === "occurrence"
              ? activeDrag.occurrenceId
              : undefined,
          ).length === 0
        )
          highlighted.push(cellId);
        else invalid.push(cellId);
      }
    }
    return { highlighted, invalid };
  }, [activeCourseKey, activeDrag, state]);

  const avatars = useMemo(
    () =>
      getAvailableProfessorAvatars(state.data?.professors ?? [], state.courses),
    [state.courses, state.data?.professors],
  );
  const occurrenceIdsByCell = useMemo(() => {
    const result = new Map<ScheduleCellId, string[]>();
    for (const course of state.courses) {
      for (const session of course.sessions) {
        for (const occurrence of session.occurrences) {
          const cellId =
            `${occurrence.day}:${occurrence.timeSlotId}` as ScheduleCellId;
          const ids = result.get(cellId) ?? [];
          ids.push(occurrence.id);
          result.set(cellId, ids);
        }
      }
    }
    return result;
  }, [state.courses]);
  const panelModel = useMemo(
    () =>
      state.data
        ? createScheduleAssignmentPanelViewModel(
            state.data,
            state.courses,
            state.selectedCourseKey,
            state.selectedSessionNumber,
          )
        : null,
    [
      state.courses,
      state.data,
      state.selectedCourseKey,
      state.selectedSessionNumber,
    ],
  );
  const sidePanelValue = createScheduleSidePanelValue(
    state.isPanelOpen,
    panelModel,
  );
  const professorOptions = useMemo(() => {
    if (!state.data || !state.selectedCourseKey || !state.selectedSessionNumber)
      return [];
    return createAssignableProfessors(
      state.data,
      state.courses,
      state.selectedCourseKey,
      state.selectedSessionNumber,
    );
  }, [
    state.courses,
    state.data,
    state.selectedCourseKey,
    state.selectedSessionNumber,
  ]);

  const onDragStart = ({ active }: DragStartEvent) => {
    const source = parseDragSource(String(active.id));
    setActiveDrag(source);
    const preview = active.data.current?.preview;
    setActiveDragCard(
      isValidElement<ScheduleClassCardProps>(preview) ? preview : null,
    );
    if (source?.kind === "course") state.selectCourse(source.courseKey);
    if (source?.kind === "occurrence")
      state.selectOccurrence(source.occurrenceId);
  };

  const onDragOver = ({ over }: DragOverEvent) => {
    const target = over
      ? resolveDropTarget(String(over.id), state.courses)
      : null;
    setDragOverCellId(target?.kind === "cell" ? target.cellId : null);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    const source = parseDragSource(String(active.id));
    const target = over
      ? resolveDropTarget(String(over.id), state.courses)
      : null;
    applyScheduleBuilderDrop(state, source, target);
    setActiveDrag(null);
    setActiveDragCard(null);
    setDragOverCellId(null);
  };

  const handleCourseClick = (courseKey: string) => {
    if (state.selectedCourseKey === courseKey && !state.selectedOccurrenceId) {
      state.clearSelection();
    } else {
      state.selectCourse(courseKey);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragCancel={() => {
        setActiveDrag(null);
        setActiveDragCard(null);
        setDragOverCellId(null);
      }}
      onDragEnd={onDragEnd}
    >
      <SidePanel.Root
        className="h-full w-full"
        mode="push"
        panel={sidePanelValue}
        onPanelChange={(panel) => {
          if (!panel) {
            state.closePanel();
            setProfessorModalOpen(false);
          }
        }}
      >
        <SidePanel.Main
          className="flex h-full min-w-0"
          data-schedule-builder-root
        >
          <OfferingCourseDropZone>
            <OfferingCourseShellContainer
              career={career}
              period={period}
              className="h-full shrink-0"
              offeringCourses={state.data?.offeringCourses}
              loading={state.isLoading}
              error={state.error}
              completedCourseKeys={selectCompletedCourseKeys(state)}
              draggingCourseKey={
                activeDrag?.kind === "course" ? activeDrag.courseKey : null
              }
              selectedCourseKey={
                state.selectedOccurrenceId ? null : state.selectedCourseKey
              }
              onCourseClick={handleCourseClick}
              renderCourseCard={(course, card) => (
                <OfferingCourseDraggable
                  key={course.key}
                  courseKey={course.key}
                  disabled={selectCompletedCourseKeys(state).includes(
                    course.key,
                  )}
                  card={card}
                />
              )}
            />
          </OfferingCourseDropZone>
          <div
            className="h-full min-w-0 flex-1"
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) state.clearSelection();
            }}
          >
            <ScheduleBuilderCanvasContainer
              className="h-full min-w-0 flex-1"
              highlightedCellIds={cellFeedback.highlighted}
              invalidCellIds={cellFeedback.invalid}
              dragOverCellIds={dragOverCellId ? [dragOverCellId] : []}
              draggingOccurrenceId={
                activeDrag?.kind === "occurrence"
                  ? activeDrag.occurrenceId
                  : null
              }
              availableProfessorAvatars={avatars}
              onCanvasBackgroundClick={state.clearSelection}
              onOccurrenceContextMenu={(_occurrenceId, event) => {
                setContextAnchor(event.currentTarget);
              }}
              onAddCourse={(cellId) => {
                if (!state.selectedCourseKey) return;
                const separator = cellId.indexOf(":");
                state.placeCourse(
                  state.selectedCourseKey,
                  cellId.slice(0, separator) as ScheduleWeekDay,
                  cellId.slice(separator + 1),
                );
              }}
              renderCell={(cellId, children, layout) => (
                <ScheduleCellDroppable
                  key={cellId}
                  cellId={cellId}
                  occurrenceIds={occurrenceIdsByCell.get(cellId) ?? []}
                  layout={layout}
                >
                  {children}
                </ScheduleCellDroppable>
              )}
              renderOccurrence={(occurrence, cellId, card) => (
                <ScheduleOccurrenceSortable
                  key={occurrence.id}
                  occurrenceId={occurrence.id}
                  cellId={cellId}
                  card={card}
                />
              )}
            />
          </div>
        </SidePanel.Main>
        <SidePanel.Viewport
          aria-label="Asignación del horario"
          className="z-40 h-full"
        >
          <SidePanel.Content type="assignment">
            {() =>
              panelModel ? (
                <ScheduleAssignmentPanel
                  {...panelModel}
                  className="h-full"
                  onClose={() => {
                    state.closePanel();
                    setProfessorModalOpen(false);
                  }}
                  onSessionSelect={(sessionId) => {
                    if (!state.selectedCourseKey) return;
                    state.selectSession(
                      state.selectedCourseKey,
                      Number(sessionId),
                    );
                  }}
                  onCapacityChange={(capacity) => {
                    if (
                      !state.selectedCourseKey ||
                      !state.selectedSessionNumber
                    )
                      return;
                    state.updateSessionCapacity(
                      state.selectedCourseKey,
                      state.selectedSessionNumber,
                      capacity,
                    );
                  }}
                  onProfessorClick={(event) => {
                    setProfessorSearch("");
                    professorModalRef.current?.open(event.currentTarget);
                  }}
                  onOccurrenceDayChange={(occurrenceId, day) => {
                    if (isScheduleWeekDay(day))
                      state.updateOccurrence(occurrenceId, { day });
                  }}
                  onOccurrenceTimeSlotChange={(occurrenceId, timeSlotId) =>
                    state.updateOccurrence(occurrenceId, { timeSlotId })
                  }
                  onOccurrenceClassroomChange={(occurrenceId, classroomId) =>
                    state.updateOccurrence(occurrenceId, {
                      classroomId: classroomId || null,
                    })
                  }
                />
              ) : null
            }
          </SidePanel.Content>
        </SidePanel.Viewport>
      </SidePanel.Root>
      <ModalProvider
        ref={professorModalRef}
        open={professorModalOpen}
        onOpenChange={setProfessorModalOpen}
        placement="left-start"
      >
        <Modal.Content>
          <ProfessorAsignModal
            professors={professorOptions}
            searchValue={professorSearch}
            onSearchValueChange={setProfessorSearch}
            onClose={() => setProfessorModalOpen(false)}
            onProfessorSelect={(professor) => {
              if (state.selectedCourseKey && state.selectedSessionNumber) {
                state.updateSessionProfessor(
                  state.selectedCourseKey,
                  state.selectedSessionNumber,
                  professor.id,
                );
              }
              setProfessorModalOpen(false);
            }}
          />
        </Modal.Content>
      </ModalProvider>
      {state.contextMenuTarget && contextAnchor ? (
        <ScheduleCardContextMenu
          anchor={contextAnchor}
          open
          onOpenChange={(open) => {
            if (!open) {
              state.closeContextMenu();
              setContextAnchor(null);
            }
          }}
          onDelete={() => {
            removeContextMenuOccurrence(
              state,
              state.contextMenuTarget!.occurrenceId,
            );
            setContextAnchor(null);
          }}
        />
      ) : null}
      <DragOverlay>
        {activeDragCard ? (
          <div data-drag-overlay>
            {cloneElement(activeDragCard, { dragging: true })}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
