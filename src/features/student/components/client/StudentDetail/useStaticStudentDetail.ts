"use client";

import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  fetchStudentById,
  fetchStudentPlan,
} from "@/external/handler/student/query.client";
import {
  toStudentClassItemUI,
  toStudentProfileUI,
  type StudentClassItem,
} from "@/features/student/types";
import {
  STUDENT_AVATAR_COLOR_PALETTE,
} from "../../ui/studentSummaryPanel/studentSummary.constant";
import {
  buildStudentDetail,
  type StudentDetail,
} from "../../ui/studentSummaryPanel/studentSummary.type";

type UseStudentPlanResult = {
  totalSemesters: number;
  loading: boolean;
  studentDetail: StudentDetail | null;
  studentGrades: StudentClassItem[];
};

type StudentPlanSnapshot = {
  student: Awaited<ReturnType<typeof fetchStudentById>>;
  plan: Awaited<ReturnType<typeof fetchStudentPlan>>;
};

const EMPTY_STUDENT_GRADES: StudentClassItem[] = [];

export function useStaticStudentDetail(
  studentId: string,
): UseStudentPlanResult {
  const snapshot = useLiveQuery<StudentPlanSnapshot | null>(
    async () => {
      try {
        const [student, plan] = await Promise.all([
          fetchStudentById(studentId),
          fetchStudentPlan(studentId),
        ]);
        return { student, plan };
      } catch (error) {
        console.error("Failed loading student plan", error);
        return null;
      }
    },
    [studentId],
  );

  const studentGrades = useMemo(
    () =>
      snapshot?.plan.map(toStudentClassItemUI) ?? EMPTY_STUDENT_GRADES,
    [snapshot],
  );

  const totalSemesters=useMemo(
    () => {
      const set= new Set<number>();
      snapshot?.plan.forEach((p)=>{if(p.semester)set.add(p.semester)});
      return set.size;
    },
    [snapshot],
  );


  const studentDetail = useMemo(() => {
    if (!snapshot?.student) return null;

    const student = toStudentProfileUI(snapshot.student);
    return buildStudentDetail(student, studentGrades, {
      avatarColorCssVar:
        STUDENT_AVATAR_COLOR_PALETTE[
          student.avatarColorRef % STUDENT_AVATAR_COLOR_PALETTE.length
        ] ?? STUDENT_AVATAR_COLOR_PALETTE[0],
      career: student.career,
      planLabel: student.career,
    });
  }, [snapshot, studentGrades]);

  return {
    loading: snapshot === undefined,
    studentDetail,
    studentGrades,
    totalSemesters
  };
}
