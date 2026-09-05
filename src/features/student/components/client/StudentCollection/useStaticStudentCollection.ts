"use client";

import { useLiveQuery } from "dexie-react-hooks";
import type { StudentCollectionSummaryDto } from "@/external/dto/student/student-collection.dto";
import { fetchStudentCollectionSummaries } from "@/external/handler/students/query.client";
import type { StudentCollectionItem } from "./studentCollection.type";

type UseStaticStudentCollectionResult = {
  loading: boolean;
  errorMessage?: string;
  studentCollection: StudentCollectionItem[];
};

type StudentCollectionSnapshot =
  | { status: "success"; studentCollection: StudentCollectionItem[] }
  | { status: "error" };

export function useStaticStudentCollection(): UseStaticStudentCollectionResult {
  const snapshot = useLiveQuery<StudentCollectionSnapshot>(
    async () => {
      try {
        return {
          status: "success",
          studentCollection: (await fetchStudentCollectionSummaries()).map(
            toStudentCollectionItem,
          ),
        };
      } catch (error) {
        console.error("Failed loading student collection", error);
        return { status: "error" };
      }
    },
    [],
  );

  return {
    loading: snapshot === undefined,
    errorMessage:
      snapshot?.status === "error"
        ? "No se pudo cargar la colección de estudiantes."
        : undefined,
    studentCollection:
      snapshot?.status === "success" ? snapshot.studentCollection : [],
  };
}

function toStudentCollectionItem(
  student: StudentCollectionSummaryDto,
): StudentCollectionItem {
  return {
    studentId: student.id,
    name: student.name,
    status: student.status,
    career: student.career,
    currentSemester: student.currentSemester,
    enrolledPeriod: student.enrolledPeriod,
    classProgress: student.classProgress,
    failedClassCount: student.failedClassCount,
    contacts: "",
  };
}
