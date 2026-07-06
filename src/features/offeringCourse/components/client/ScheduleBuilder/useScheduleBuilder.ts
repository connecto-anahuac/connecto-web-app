"use client";

import {
  fetchOfferingCoursesByCareer,
  fetchSelectedOfferingCourses,
  updateOfferingCourseselection,
} from "@/external/handler/offering-course/query.client";
import {
  toOfferingCourseUI,
  toUpdateOfferingCourseSelectionInput,
} from "@/features/offeringCourse/types/offering-course";
import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";
import { getTotalEligibleStudents } from "@/features/offeringCourse/lib/get-total-eligible-students";
import { useEffect, useState } from "react";

type UseScheduleBuilderResult = {
  error: string | null;
  loading: boolean;
  offeringCourses: OfferingCourse[];
  pendingCourseKeys: string[];
  selectedCourseKeys: string[];
  toggleOfferingCourse: (offeringCourse: OfferingCourse) => Promise<void>;
};

export function useScheduleBuilder(career: string): UseScheduleBuilderResult {
  const [offeringCourses, setOfferingCourses] = useState<OfferingCourse[]>([]);
  const [selectedCourseKeys, setSelectedCourseKeys] = useState<string[]>([]);
  const [pendingCourseKeys, setPendingCourseKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadOfferingCourses() {
      setLoading(true);
      setError(null);
      setPendingCourseKeys([]);

      try {
        const [items, selectedOfferingCourses] = await Promise.all([
          fetchOfferingCoursesByCareer(career),
          fetchSelectedOfferingCourses(career),
        ]);

        if (!mounted) {
          return;
        }

        setOfferingCourses(items.map(toOfferingCourseUI));
        setSelectedCourseKeys([
          ...new Set(selectedOfferingCourses.map((item) => item.courseKey)),
        ]);
      } catch (loadError) {
        if (!mounted) {
          return;
        }

        console.error("Failed loading offering Courses", loadError);
        setError("Failed loading offering Courses");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadOfferingCourses();

    return () => {
      mounted = false;
    };
  }, [career]);

  async function toggleOfferingCourse(offeringCourse: OfferingCourse) {
    if (pendingCourseKeys.includes(offeringCourse.key)) {
      return;
    }

    const isCurrentlySelected = selectedCourseKeys.includes(offeringCourse.key);
    const nextIsSelected = !isCurrentlySelected;

    setPendingCourseKeys((currentKeys) => [...currentKeys, offeringCourse.key]);
    setSelectedCourseKeys((currentKeys) =>
      nextIsSelected
        ? [...currentKeys, offeringCourse.key]
        : currentKeys.filter((currentKey) => currentKey !== offeringCourse.key),
    );

    try {
      await updateOfferingCourseselection(
        toUpdateOfferingCourseSelectionInput(
          offeringCourse,
          career,
          getTotalEligibleStudents(offeringCourse),
          nextIsSelected,
        ),
      );
    } catch (toggleError) {
      console.error("Failed toggling offering Course selection", toggleError);
      setSelectedCourseKeys((currentKeys) =>
        isCurrentlySelected
          ? [...currentKeys, offeringCourse.key]
          : currentKeys.filter((currentKey) => currentKey !== offeringCourse.key),
      );
    } finally {
      setPendingCourseKeys((currentKeys) =>
        currentKeys.filter((currentKey) => currentKey !== offeringCourse.key),
      );
    }
  }

  return {
    error,
    loading,
    offeringCourses,
    pendingCourseKeys,
    selectedCourseKeys,
    toggleOfferingCourse,
  };
}