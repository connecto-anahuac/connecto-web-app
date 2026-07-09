"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { universityDb } from "@/external/client/university-db";

export function RootPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function routeByIndexedDbData() {
      try {
        await universityDb.open();
        const studentCount = await universityDb.students.count();

        if (!isMounted) return;
        router.replace(studentCount > 0 ? "/students" : "/data");
      } catch {
        if (!isMounted) return;
        router.replace("/data");
      }
    }

    routeByIndexedDbData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return null;
}