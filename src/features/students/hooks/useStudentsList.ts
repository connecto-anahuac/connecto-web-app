"use client";

import { fetchStudents } from "@/external/handler/students/query.client";
import { useEffect, useState } from "react";
import type { StudentListItem } from "../types/student-list-item";

type UseStudentsListResult = {
  students: StudentListItem[];
  loading: boolean;
};

function mapStudent(student: Awaited<ReturnType<typeof fetchStudents>>[number]): StudentListItem {
  return {
    id: student.id,
    name: student.name,
    status: student.status,
    career: "TIND",
    plan: "plan 2020",
    semester: String(student.currentSemesterWithoutSummer ?? student.currentSemester ?? "-"),
  };
}

export function useStudentsList(): UseStudentsListResult {
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadStudents() {
      try {
        const result = await fetchStudents();
        if (!mounted) {
          return;
        }

        setStudents(result.map(mapStudent));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadStudents();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    students,
    loading,
  };
}