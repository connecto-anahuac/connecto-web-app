"use client";

import type { OfferingCourseDetailDto } from "@/external/dto/offering-course/offering-course.dto";
import { updateOfferingCourseSelection } from "@/external/handler/offering-course/command.client";
import {
  fetchOfferingCourseDetail,
  fetchOfferingCoursesByCareer,
  fetchSelectedOfferingCourses,
} from "@/external/handler/offering-course/query.client";
import { toOfferingCourseUI, type OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { type OfferingCourseDraft, type ScheduleBuilderStore } from "./scheduleBuilderStore";
import { useScheduleBuilderStore } from "./ScheduleBuilderStateProvider";

export type { OfferingCourseDraft } from "./scheduleBuilderStore";

type Result = {
  closePanel: () => void;
  detailError: string | null;
  detailLoading: boolean;
  drafts: Record<string, OfferingCourseDraft>;
  error: string | null;
  isPanelOpen: boolean;
  loading: boolean;
  offeringCourses: OfferingCourse[];
  offerCourse: (course: OfferingCourse) => Promise<void>;
  openCourse: (course: OfferingCourse) => void;
  pendingCourseKeys: string[];
  selectedCourseDetail: OfferingCourseDetailDto | null;
  selectedDraft: OfferingCourseDraft | null;
  selectedCourseKeys: string[];
  setSelectedStudentIds: (planId: string, studentId: string, isSelected: boolean) => Promise<void>;
  setSessionNumber: (sessionNumber: number) => Promise<void>;
  setCourseSessionNumber: (course: OfferingCourse, sessionNumber: number) => Promise<void>;
  unofferCourse: (course: OfferingCourse) => Promise<void>;
};

const copyIds = (value: Record<string, string[]>) =>
  Object.fromEntries(Object.entries(value).map(([planId, ids]) => [planId, [...new Set(ids)]]));

const defaultDraft = (detail: OfferingCourseDetailDto): OfferingCourseDraft => ({
  sessionNumber: detail.sessionNumber,
  enabledStudentIdsByStudyPlan: Object.fromEntries(
    detail.studyPlans.map((plan) => [
      plan.studyPlanId,
      plan.semesters
        .filter((semester) => semester.semester >= plan.recommendedSemester)
        .flatMap((semester) => semester.eligibleStudents.map((student) => student.id)),
    ]),
  ),
});

const selectStore = (state: ScheduleBuilderStore) => ({
  closePanel: state.closePanel,
  detailError: state.detailError,
  detailLoading: state.detailLoading,
  drafts: state.drafts,
  finishPending: state.finishPending,
  hydrate: state.hydrate,
  isPanelOpen: state.isPanelOpen,
  markOffered: state.markOffered,
  markUnoffered: state.markUnoffered,
  openPanel: state.openCourse,
  pendingCourseKeys: state.pendingCourseKeys,
  resetForScope: state.resetForScope,
  selectedCourseDetail: state.selectedCourseDetail,
  selectedCourseKey: state.selectedCourseKey,
  selectedCourseKeys: state.selectedCourseKeys,
  setDetailError: state.setDetailError,
  setDetailLoading: state.setDetailLoading,
  setDraft: state.setDraft,
  setDraftChangeHandler: state.setDraftChangeHandler,
  setSelectedCourseDetail: state.setSelectedCourseDetail,
  startPending: state.startPending,
});

/** Fetches course data and persists selection updates; interaction state lives in Zustand. */
export function useScheduleBuilder(career: string, period: string): Result {
  const store = useScheduleBuilderStore(useShallow(selectStore));
  const { hydrate, resetForScope } = store;
  const [offeringCourses, setOfferingCourses] = useState<OfferingCourse[]>([]);
  const [details, setDetails] = useState<Record<string, OfferingCourseDetailDto>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentCourseKeyRef = useRef<string | null>(null);
  const scope = useMemo(() => ({ career, period }), [career, period]);
  const activeScopeRef = useRef(scope);
  const isActiveScope = useCallback(
    () => activeScopeRef.current === scope,
    [scope],
  );

  useEffect(() => {
    let mounted = true;
    activeScopeRef.current = scope;
    currentCourseKeyRef.current = null;
    resetForScope(career, period);
    const load = async () => {
      if (mounted) {
        setDetails({});
        setLoading(true);
        setError(null);
      }
      try {
        const [items, selected] = await Promise.all([
          fetchOfferingCoursesByCareer(career),
          fetchSelectedOfferingCourses(career, period),
        ]);
        if (!mounted) return;
        setOfferingCourses(items.map(toOfferingCourseUI));
        hydrate(career, period, selected.map((item) => ({
          courseKey: item.courseKey,
          draft: item.enabledStudentIdsByStudyPlan === undefined
            ? undefined
            : {
                enabledStudentIdsByStudyPlan: copyIds(item.enabledStudentIdsByStudyPlan),
                sessionNumber: item.sessionNumber,
              },
        })));
      } catch (cause) {
        if (mounted) {
          console.error("Failed loading offering courses", cause);
          setError("Failed loading offering courses");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [career, hydrate, period, resetForScope, scope]);

  const ensureDetail = useCallback(async (course: OfferingCourse) => {
    const cached = details[course.key];
    if (cached) return cached;
    store.setDetailLoading(true);
    store.setDetailError(null);
    try {
      const detail = await fetchOfferingCourseDetail(career, course.key, period);
      if (!isActiveScope()) return null;
      if (!detail) throw new Error("Course detail was not found");
      setDetails((current) => ({ ...current, [course.key]: detail }));
      if (!store.drafts[course.key]) {
        store.setDraft(course.key, detail.enabledStudentIdsByStudyPlan === undefined
          ? defaultDraft(detail)
          : {
              enabledStudentIdsByStudyPlan: copyIds(detail.enabledStudentIdsByStudyPlan),
              sessionNumber: detail.sessionNumber,
            });
      }
      if (currentCourseKeyRef.current === course.key) store.setSelectedCourseDetail(detail);
      return detail;
    } catch (cause) {
      console.error("Failed loading offering course detail", cause);
      if (isActiveScope() && currentCourseKeyRef.current === course.key)
        store.setDetailError("Failed loading offering course detail");
      return null;
    } finally {
      if (isActiveScope() && currentCourseKeyRef.current === course.key)
        store.setDetailLoading(false);
    }
  }, [career, details, isActiveScope, period, store]);

  const persistOffer = useCallback(async (courseKey: string, draft: OfferingCourseDraft) => {
    store.startPending(courseKey);
    try {
      await updateOfferingCourseSelection({
        career,
        courseKey,
        enabledStudentIdsByStudyPlan: copyIds(draft.enabledStudentIdsByStudyPlan),
        isSelected: true,
        period,
        sessionNumber: draft.sessionNumber,
      });
      if (isActiveScope()) store.markOffered(courseKey);
    } finally {
      if (isActiveScope()) store.finishPending(courseKey);
    }
  }, [career, isActiveScope, period, store]);

  const openCourse = useCallback((course: OfferingCourse) => {
    currentCourseKeyRef.current = course.key;
    store.openPanel(course.key);
    const cached = details[course.key];
    if (cached) {
      store.setSelectedCourseDetail(cached);
      store.setDetailLoading(false);
    } else {
      void ensureDetail(course);
    }
  }, [details, ensureDetail, store]);

  const offerCourse = useCallback(async (course: OfferingCourse) => {
    if (store.pendingCourseKeys.includes(course.key)) return;
    openCourse(course);
    const detail = await ensureDetail(course);
    if (!detail) return;
    const draft = store.drafts[course.key] ?? defaultDraft(detail);
    store.setDraft(course.key, draft);
    try {
      await persistOffer(course.key, draft);
    } catch (cause) {
      console.error("Failed offering course", cause);
      if (isActiveScope()) store.setDetailError("Failed saving offering course");
    }
  }, [ensureDetail, isActiveScope, openCourse, persistOffer, store]);

  const unofferCourse = useCallback(async (course: OfferingCourse) => {
    if (store.pendingCourseKeys.includes(course.key)) return;
    const wasSelected = store.selectedCourseKeys.includes(course.key);
    store.startPending(course.key);
    store.markUnoffered(course.key);
    try {
      await updateOfferingCourseSelection({
        career,
        courseKey: course.key,
        isSelected: false,
        period,
      });
    } catch (cause) {
      console.error("Failed removing offered course", cause);
      if (isActiveScope()) {
        if (wasSelected) store.markOffered(course.key);
        store.setDetailError("Failed removing offered course");
      }
    } finally {
      if (isActiveScope()) store.finishPending(course.key);
    }
  }, [career, isActiveScope, period, store]);

  const updateDraft = useCallback(async (next: OfferingCourseDraft) => {
    const courseKey = store.selectedCourseKey;
    if (!courseKey || !store.selectedCourseKeys.includes(courseKey) || store.pendingCourseKeys.includes(courseKey))
      return;
    const previous = store.drafts[courseKey];
    store.setDraft(courseKey, next);
    try {
      await persistOffer(courseKey, next);
    } catch (cause) {
      console.error("Failed saving offering course", cause);
      if (isActiveScope()) {
        if (previous) store.setDraft(courseKey, previous);
        store.setDetailError("Failed saving offering course");
      }
    }
  }, [isActiveScope, persistOffer, store]);

  const setCourseSessionNumber = useCallback(async (course: OfferingCourse, sessionNumber: number) => {
    if (!store.selectedCourseKeys.includes(course.key) || store.pendingCourseKeys.includes(course.key)) return;
    const previous = store.drafts[course.key];
    if (!previous) return;
    const next = { ...previous, sessionNumber: Math.max(0, sessionNumber) };
    store.setDraft(course.key, next);
    try {
      await persistOffer(course.key, next);
    } catch (cause) {
      console.error("Failed saving offering course", cause);
      if (isActiveScope()) {
        store.setDraft(course.key, previous);
        store.setDetailError("Failed saving offering course");
      }
    }
  }, [isActiveScope, persistOffer, store]);

  const setSelectedStudentIds = useCallback(async (planId: string, studentId: string, isSelected: boolean) => {
    const courseKey = store.selectedCourseKey;
    if (!courseKey) return;
    const current = store.drafts[courseKey];
    if (!current) return;
    const ids = current.enabledStudentIdsByStudyPlan[planId] ?? [];
    await updateDraft({
      ...current,
      enabledStudentIdsByStudyPlan: {
        ...current.enabledStudentIdsByStudyPlan,
        [planId]: isSelected ? [...new Set([...ids, studentId])] : ids.filter((id) => id !== studentId),
      },
    });
  }, [store, updateDraft]);

  const setSessionNumber = useCallback(async (value: number) => {
    const courseKey = store.selectedCourseKey;
    const current = courseKey ? store.drafts[courseKey] : undefined;
    if (current) await updateDraft({ ...current, sessionNumber: Math.max(0, value) });
  }, [store, updateDraft]);

  useEffect(() => {
    store.setDraftChangeHandler((courseKey, next, previous) => {
      if (!store.selectedCourseKeys.includes(courseKey)) return;
      if (next.sessionNumber === 0) {
        store.startPending(courseKey);
        store.markUnoffered(courseKey);
        void updateOfferingCourseSelection({
          career,
          courseKey,
          isSelected: false,
          period,
        })
          .catch((cause) => {
            console.error("Failed removing offered course", cause);
            if (isActiveScope()) {
              store.setDraft(courseKey, previous);
              store.markOffered(courseKey);
              store.setDetailError("Failed removing offered course");
            }
          })
          .finally(() => {
            if (isActiveScope()) store.finishPending(courseKey);
          });
        return;
      }
      void persistOffer(courseKey, next).catch((cause) => {
        console.error("Failed saving offering course", cause);
        if (isActiveScope()) {
          store.setDraft(courseKey, previous);
          store.setDetailError("Failed saving offering course");
        }
      });
    });
    return () => store.setDraftChangeHandler(null);
  }, [career, isActiveScope, period, persistOffer, store]);

  return {
    closePanel: () => { currentCourseKeyRef.current = null; store.closePanel(); },
    detailError: store.detailError,
    detailLoading: store.detailLoading,
    drafts: store.drafts,
    error,
    isPanelOpen: store.isPanelOpen,
    loading,
    offeringCourses,
    offerCourse,
    openCourse,
    pendingCourseKeys: store.pendingCourseKeys,
    selectedCourseDetail: store.selectedCourseDetail,
    selectedDraft: store.selectedCourseKey ? (store.drafts[store.selectedCourseKey] ?? null) : null,
    selectedCourseKeys: store.selectedCourseKeys,
    setSelectedStudentIds,
    setCourseSessionNumber,
    setSessionNumber,
    unofferCourse,
  };
}
