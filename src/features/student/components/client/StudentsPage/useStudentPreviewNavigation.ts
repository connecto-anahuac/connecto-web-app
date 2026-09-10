"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function toStudentsUrl(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function useStudentPreviewNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectStudent = (studentId: string) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set("studentId", studentId);
    router.replace(toStudentsUrl(pathname, nextSearchParams));
  };

  const closeStudentPreview = () => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("studentId");
    router.replace(toStudentsUrl(pathname, nextSearchParams));
  };

  const openStudentDetail = (studentId: string) => {
    router.push(`/students/${encodeURIComponent(studentId)}`);
  };

  return {
    closeStudentPreview,
    openStudentDetail,
    selectStudent,
  };
}
