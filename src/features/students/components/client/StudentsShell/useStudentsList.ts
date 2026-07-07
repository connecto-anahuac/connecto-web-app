"use client";

import { fetchStudents } from "@/external/handler/students/query.client";
import { useEffect, useState } from "react";
import type { StudentListItem } from "../../../types/student-list-item";
import { StudentDto } from "@/external/dto/student/student.dto";

type UseStudentsListResult = {
  students: StudentListItem[];
  loading: boolean;
};

const AVATOR_COLOR_PALETTE = [
  "--ADM-strong",
  "--CMP-strong",
  "--CUL-strong",
  "--SOC-strong",
  "--IELC-strong",
  "--EMP-strong",
  "--FIS-strong",
  "--HUM-strong",
  "--IIND-strong",
  "--CON-strong",
  "--INT-strong",
  "--LDR-strong",
  "--MAT-strong",
  "--SIS-strong",
];

function mapStudent(
  student: StudentDto,
): StudentListItem {
  return {
    id: student.id,
    name: student.name,
    status: student.status,
    career: "TIND",
    plan: "plan 2020",
    semester: String(
      student.currentSemester ?? student.regularSemestersCount ?? "-",
    ),
    avatarColorCssVar: AVATOR_COLOR_PALETTE[student.avatarColorRef % AVATOR_COLOR_PALETTE.length] ?? AVATOR_COLOR_PALETTE[0],
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
        const studentsList = result.map(mapStudent);
        
        setStudents(studentsList);
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
