"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function withQuery(pathname: string, query: URLSearchParams) {
  const value = query.toString();
  return value ? `${pathname}?${value}` : pathname;
}

export function usePlanPreviewNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  return {
    selectPlan(id: string) {
      const query = new URLSearchParams(searchParams.toString());
      query.set("planId", id);
      router.replace(withQuery(pathname, query));
    },
    closePlanPreview() {
      const query = new URLSearchParams(searchParams.toString());
      query.delete("planId");
      router.replace(withQuery(pathname, query));
    },
    openPlanDetail(id: string) {
      router.push(`/plans/${encodeURIComponent(id)}`);
    },
  };
}
