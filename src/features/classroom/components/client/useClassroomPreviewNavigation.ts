"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function withQuery(pathname: string, query: URLSearchParams) {
  const value = query.toString();
  return value ? `${pathname}?${value}` : pathname;
}

export function useClassroomPreviewNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  return {
    selectClassroom(id: string) {
      const query = new URLSearchParams(searchParams.toString());
      query.set("classroomId", id);
      router.replace(withQuery(pathname, query));
    },
    closeClassroomPreview() {
      const query = new URLSearchParams(searchParams.toString());
      query.delete("classroomId");
      router.replace(withQuery(pathname, query));
    },
    openClassroomDetail(id: string) {
      router.push(`/classrooms/${encodeURIComponent(id)}`);
    },
  };
}
