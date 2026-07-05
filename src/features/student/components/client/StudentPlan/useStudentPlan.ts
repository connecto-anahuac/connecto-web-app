"use client";

import {
  fetchStudentById,
  fetchStudentPlan,
} from "@/external/handler/student/query.client";
import { useEffect, useState } from "react";
import type { StudentClassItem, StudentProfile } from "@/features/student/types/types";

type UseStudentPlanResult = {
  loading: boolean;
  plan: StudentClassItem[];
  student: StudentProfile | null;
};

function mapStudent(student: NonNullable<Awaited<ReturnType<typeof fetchStudentById>>>): StudentProfile {
  return {
    id: student.id,
    name: student.name,
    status: student.status,
    enrolledPeriod: student.enrolledPeriod,
    currentSemester: student.currentSemester,
  };
}

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

        setStudent(studentResult ? mapStudent(studentResult) : null);
        setPlan(planResult);
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