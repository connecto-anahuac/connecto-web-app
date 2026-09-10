"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function withQuery(pathname: string, query: URLSearchParams) {
  const value = query.toString();
  return value ? `${pathname}?${value}` : pathname;
}

export function useProfessorNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = (mutate: (query: URLSearchParams) => void) => {
    const query = new URLSearchParams(searchParams.toString());
    mutate(query);
    router.replace(withQuery(pathname, query));
  };

  return {
    selectProfessor: (id: string) => update((query) => query.set("professorId", id)),
    closePreview: () => update((query) => query.delete("professorId")),
    setPeriod: (period: string) => update((query) => period ? query.set("period", period) : query.delete("period")),
    openDetail: (id: string) => {
      const query = new URLSearchParams();
      const period = searchParams.get("period");
      if (period) query.set("period", period);
      router.push(withQuery(`/professors/${encodeURIComponent(id)}`, query));
    },
  };
}
