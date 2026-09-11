import { createStore } from "zustand/vanilla";
import type { OfferingCourseDetailDto } from "@/external/dto/offering-course/offering-course.dto";

export type OfferingCourseDraft = {
  enabledStudentIdsByStudyPlan: Record<string, string[]>;
  sessionNumber: number;
};

export type HydratedOfferingCourseSelection = {
  courseKey: string;
  draft?: OfferingCourseDraft;
};

export type ScheduleBuilderState = {
  career: string | null;
  drafts: Record<string, OfferingCourseDraft>;
  detailError: string | null;
  detailLoading: boolean;
  hydrated: boolean;
  isPanelOpen: boolean;
  onDraftChange: ((
    courseKey: string,
    next: OfferingCourseDraft,
    previous: OfferingCourseDraft,
  ) => void) | null;
  pendingCourseKeys: string[];
  selectedCourseKey: string | null;
  selectedCourseDetail: OfferingCourseDetailDto | null;
  selectedCourseKeys: string[];
  selectedStudyPlanId: string | null;
  semesterEnabledByCourse: Record<
    string,
    Record<string, Record<string, boolean>>
  >;
};

export type ScheduleBuilderCommands = {
  closePanel: () => void;
  finishPending: (courseKey: string) => void;
  hydrate: (
    career: string,
    selections: HydratedOfferingCourseSelection[],
  ) => void;
  openCourse: (courseKey: string) => void;
  resetForCareer: (career: string) => void;
  setDraft: (courseKey: string, draft: OfferingCourseDraft) => void;
  setDetailError: (error: string | null) => void;
  setDetailLoading: (loading: boolean) => void;
  setSelectedCourseDetail: (detail: OfferingCourseDetailDto | null) => void;
  setSelectedStudyPlanId: (studyPlanId: string | null) => void;
  setSemesterEnabled: (
    courseKey: string,
    studyPlanId: string,
    semesterId: string,
    enabled: boolean,
  ) => void;
  setSelectedStudentIds: (
    studyPlanId: string,
    studentId: string,
    enabled: boolean,
  ) => void;
  setSessionNumber: (sessionNumber: number) => void;
  startPending: (courseKey: string) => void;
  markOffered: (courseKey: string) => void;
  markUnoffered: (courseKey: string) => void;
  setDraftChangeHandler: (
    handler: ScheduleBuilderState["onDraftChange"],
  ) => void;
};

export type ScheduleBuilderStore = ScheduleBuilderState &
  ScheduleBuilderCommands;

const emptyState = (career: string | null): ScheduleBuilderState => ({
  career,
  drafts: {},
  detailError: null,
  detailLoading: false,
  hydrated: false,
  isPanelOpen: false,
  onDraftChange: null,
  pendingCourseKeys: [],
  selectedCourseKey: null,
  selectedCourseDetail: null,
  selectedCourseKeys: [],
  selectedStudyPlanId: null,
  semesterEnabledByCourse: {},
});

const copyDraft = (draft: OfferingCourseDraft): OfferingCourseDraft => ({
  sessionNumber: Math.max(0, draft.sessionNumber),
  enabledStudentIdsByStudyPlan: Object.fromEntries(
    Object.entries(draft.enabledStudentIdsByStudyPlan).map(([planId, ids]) => [
      planId,
      [...new Set(ids)],
    ]),
  ),
});

/**
 * Client-side source of truth for a single Schedule Builder instance.
 * The store deliberately holds only serializable selection state; course data is
 * fetched by useScheduleBuilder and remains outside this interaction store.
 */
export function createScheduleBuilderStore() {
  return createStore<ScheduleBuilderStore>((set, get) => ({
    ...emptyState(null),
    closePanel: () =>
      set({
        detailError: null,
        detailLoading: false,
        isPanelOpen: false,
        selectedCourseDetail: null,
        selectedCourseKey: null,
      }),
    finishPending: (courseKey) =>
      set((state) => ({
        pendingCourseKeys: state.pendingCourseKeys.filter(
          (key) => key !== courseKey,
        ),
      })),
    hydrate: (career, selections) =>
      set((state) => {
        // A delayed response for the previous career must not replace new state.
        if (state.career !== career) return state;

        const drafts = Object.fromEntries(
          selections.flatMap(({ courseKey, draft }) =>
            draft ? [[courseKey, copyDraft(draft)]] : [],
          ),
        );
        return {
          drafts,
          hydrated: true,
          pendingCourseKeys: [],
          selectedCourseKeys: [...new Set(selections.map(({ courseKey }) => courseKey))],
        };
      }),
    markOffered: (courseKey) =>
      set((state) => ({
        selectedCourseKeys: state.selectedCourseKeys.includes(courseKey)
          ? state.selectedCourseKeys
          : [...state.selectedCourseKeys, courseKey],
      })),
    markUnoffered: (courseKey) =>
      set((state) => ({
        selectedCourseKeys: state.selectedCourseKeys.filter(
          (key) => key !== courseKey,
        ),
      })),
    openCourse: (courseKey) =>
      set({
        detailError: null,
        detailLoading: true,
        isPanelOpen: true,
        selectedCourseDetail: null,
        selectedCourseKey: courseKey,
      }),
    resetForCareer: (career) => set(emptyState(career)),
    setDraft: (courseKey, draft) =>
      set((state) => ({
        drafts: { ...state.drafts, [courseKey]: copyDraft(draft) },
      })),
    setDraftChangeHandler: (onDraftChange) => set({ onDraftChange }),
    setDetailError: (detailError) => set({ detailError }),
    setDetailLoading: (detailLoading) => set({ detailLoading }),
    setSelectedCourseDetail: (selectedCourseDetail) =>
      set({ selectedCourseDetail }),
    setSelectedStudyPlanId: (selectedStudyPlanId) => set({ selectedStudyPlanId }),
    setSemesterEnabled: (courseKey, studyPlanId, semesterId, enabled) =>
      set((state) => ({
        semesterEnabledByCourse: {
          ...state.semesterEnabledByCourse,
          [courseKey]: {
            ...state.semesterEnabledByCourse[courseKey],
            [studyPlanId]: {
              ...state.semesterEnabledByCourse[courseKey]?.[studyPlanId],
              [semesterId]: enabled,
            },
          },
        },
      })),
    setSelectedStudentIds: (studyPlanId, studentId, enabled) =>
      set((state) => {
        if (!state.selectedCourseKey) return state;
        if (state.pendingCourseKeys.includes(state.selectedCourseKey)) return state;
        const draft = state.drafts[state.selectedCourseKey];
        if (!draft) return state;
        const studentIds = draft.enabledStudentIdsByStudyPlan[studyPlanId] ?? [];
        const next = {
          ...draft,
          enabledStudentIdsByStudyPlan: {
            ...draft.enabledStudentIdsByStudyPlan,
            [studyPlanId]: enabled
              ? [...new Set([...studentIds, studentId])]
              : studentIds.filter((id) => id !== studentId),
          },
        };
        const courseKey = state.selectedCourseKey;
        const career = state.career;
        queueMicrotask(() => {
          const current = get();
          if (
            current.career === career &&
            current.selectedCourseKeys.includes(courseKey) &&
            current.drafts[courseKey] === next
          ) {
            current.onDraftChange?.(courseKey, next, draft);
          }
        });
        return {
          drafts: {
            ...state.drafts,
            [state.selectedCourseKey]: next,
          },
        };
      }),
    setSessionNumber: (sessionNumber) =>
      set((state) => {
        if (!state.selectedCourseKey) return state;
        if (state.pendingCourseKeys.includes(state.selectedCourseKey)) return state;
        const draft = state.drafts[state.selectedCourseKey];
        if (!draft) return state;
        const next = { ...draft, sessionNumber: Math.max(0, sessionNumber) };
        const courseKey = state.selectedCourseKey;
        const career = state.career;
        queueMicrotask(() => {
          const current = get();
          if (
            current.career === career &&
            current.selectedCourseKeys.includes(courseKey) &&
            current.drafts[courseKey] === next
          ) {
            current.onDraftChange?.(courseKey, next, draft);
          }
        });
        return {
          drafts: {
            ...state.drafts,
            [state.selectedCourseKey]: next,
          },
        };
      }),
    startPending: (courseKey) =>
      set((state) => ({
        pendingCourseKeys: state.pendingCourseKeys.includes(courseKey)
          ? state.pendingCourseKeys
          : [...state.pendingCourseKeys, courseKey],
      })),
  }));
}
