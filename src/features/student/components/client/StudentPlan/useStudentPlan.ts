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

type UseStudentPlanResult = {
  loading: boolean;
  plan: StudentClassItem[];
  student: StudentProfile | null;
};

export function useStudentPlan(studentId: string): UseStudentPlanResult {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [plan, setPlan] = useState<StudentClassItem[]>([]);
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

        setStudent(studentResult ? toStudentProfileUI(studentResult) : null);
        setPlan(planResult.map(toStudentClassItemUI));
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
  };
}