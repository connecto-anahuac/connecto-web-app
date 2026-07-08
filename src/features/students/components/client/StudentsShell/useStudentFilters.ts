"use client";

import { useMemo, useState } from "react";
import type { StudentListItem } from "../../../types/student-list-item";
import { STUDENT_FILTER_FIELDS } from "@/features/search/shared/student-filter-fields";
import { buildFilterDefinitions } from "@/features/search/shared/filter-factory";
import { applyFilters } from "@/features/search/shared/filter-engine";
import { useFilterStore } from "@/features/search/shared/filter-store";

/**
 * Student リストにフィルター（条件 + フリーテキスト検索）を適用するフック。
 *
 * - definitions は宣言的な field 定義から自動生成し、選択肢は現在の students から導出する
 * - conditions は zustand store（filter モーダルが更新）から取得
 * - フリーテキスト検索は name / id / status に対する部分一致
 */
export function useStudentFilters(students: StudentListItem[]) {
  const [searchText, setSearchText] = useState("");
  const conditions = useFilterStore((state) => state.conditions);

  const definitions = useMemo(
    () => buildFilterDefinitions(STUDENT_FILTER_FIELDS, students),
    [students],
  );

  const filteredStudents = useMemo(() => {
    const byConditions = applyFilters(students, definitions, conditions);
    const query = searchText.trim().toLocaleLowerCase();

    if (!query) {
      return byConditions;
    }

    return byConditions.filter((student) =>
      [student.name, student.id, student.status].some((field) =>
        field.toLocaleLowerCase().includes(query),
      ),
    );
  }, [students, definitions, conditions, searchText]);

  return { filteredStudents, definitions, searchText, setSearchText };
}
