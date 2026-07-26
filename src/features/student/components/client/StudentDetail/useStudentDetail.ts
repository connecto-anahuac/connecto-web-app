"use client";

import {
  fetchStudentById,
  fetchStudentPlan,
} from "@/external/handler/student/query.client";
import { useEffect, useMemo, useState } from "react";
import {
  toStudentClassItemUI,
  toStudentProfileUI,
  type StudentClassItem,
  type StudentProfile,
} from "@/features/student/types";
import {
  STUDENT_AVATAR_COLOR_PALETTE,
  STUDENT_DETAIL_CAREER,
  STUDENT_DETAIL_PLAN,
} from "../../ui/student-summary-panel/student-summary.constants";
import {
  buildStudentDetail,
  type StudentDetail,
} from "../../ui/student-summary-panel/student-summary.types";
import { useFilters } from "@/features/search/shared/useFilters";
import { STUDENT_GRADE_FILTER_FIELDS } from "@/features/student/types/student-grade-filter-fields";
import { FilterDefinition } from "@/features/search/shared/filter-definition";
import { applyFilters } from "@/features/search/shared/filter-engine";

type UseStudentDetailResult = {
  loading: boolean;
  definitions: FilterDefinition<StudentClassItem>[];
  // searchText: string;
  // setSearchText: (value: string) => void;
  hasActiveFilters: boolean;
  allItems: StudentClassItem[];
  filteredItems: StudentClassItem[];
  matchingPlanIds: Set<string>;
};

export function useStudentDetail(studentId: string): UseStudentDetailResult {
  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState<StudentClassItem[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadStudentPlan() {
      setLoading(true);

      try {
        const planResult = await fetchStudentPlan(studentId);

        if (!mounted) {
          return;
        }

        const nextPlan = planResult.map(toStudentClassItemUI);
        setItems(nextPlan);
      } catch (error) {
        console.error("Failed loading student plan", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadStudentPlan();

    return () => {
      mounted = false;
    };
  }, [studentId]);

  const { definitions, hasActiveFilters, conditions } = useFilters(
    STUDENT_GRADE_FILTER_FIELDS,
    items,
  );

  const filteredItems = useMemo(
    () => applyFilters(items, definitions, conditions),
    [items, definitions, conditions],
  );
  const matchingPlanIds = useMemo(
    () => new Set(filteredItems.map((item) => item.id)),
    [filteredItems],
  );

  return {
    loading,
    definitions,
    hasActiveFilters,
    allItems: items,
    filteredItems,
    matchingPlanIds,
  };
}
