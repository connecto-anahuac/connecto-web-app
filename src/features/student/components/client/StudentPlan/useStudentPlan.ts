"use client";

import {
  fetchStudentById,
  fetchStudentPlan,
} from "@/external/handler/student/query.client";
import { useEffect, useState } from "react";
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
import { buildStudentSummary, type StudentSummary } from "../../ui/student-summary-panel/student-summary.types";

type UseStudentPlanResult = {
  loading: boolean;
  plan: StudentClassItem[];
  student: StudentProfile | null;
  summary: StudentSummary | null;
};

export function useStudentPlan(studentId: string): UseStudentPlanResult {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [plan, setPlan] = useState<StudentClassItem[]>([]);
  const [summary, setSummary] = useState<StudentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadStudentPlan() {
      setLoading(true);

      try {
        const [studentResult, planResult] = await Promise.all([
          fetchStudentById(studentId),
          fetchStudentPlan(studentId),
        ]);

        if (!mounted) {
          return;
        }

        const nextStudent = studentResult ? toStudentProfileUI(studentResult) : null;
        const nextPlan = planResult.map(toStudentClassItemUI);

        setStudent(nextStudent);
        setPlan(nextPlan);
        setSummary(
          nextStudent
            ? buildStudentSummary(nextStudent, nextPlan, {
                avatarColorCssVar:
                  STUDENT_AVATAR_COLOR_PALETTE[
                    nextStudent.avatarColorRef % STUDENT_AVATAR_COLOR_PALETTE.length
                  ] ?? STUDENT_AVATAR_COLOR_PALETTE[0],
                career: STUDENT_DETAIL_CAREER,
                planLabel: STUDENT_DETAIL_PLAN,
              })
            : null,
        );
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

  return {
    loading,
    plan,
    student,
    summary,
  };
}