"use client";

import { useEffect, useRef } from "react";
import { createScheduleBuilderLoader } from "./scheduleBuilderLoader";
import { useScheduleBuilderStoreApi } from "./ScheduleBuilderStoreProvider";

export function useScheduleBuilderScope(career: string, period: string) {
  const store = useScheduleBuilderStoreApi();
  const loaderRef = useRef<ReturnType<typeof createScheduleBuilderLoader> | null>(null);
  loaderRef.current ??= createScheduleBuilderLoader();

  useEffect(() => {
    let mounted = true;
    const state = store.getState();
    state.resetForScope(career, period);
    store.getState().setLoading(true);

    void loaderRef.current?.load(career, period).then((result) => {
      if (!mounted || !result) return;
      const current = store.getState();
      if (current.career !== career || current.period !== period) return;
      if (result.status === "error") {
        current.setError(result.message);
        return;
      }
      if (result.data.career !== career || result.data.period !== period) {
        current.setError("Schedule builder response did not match the active scope");
        return;
      }
      current.hydrate(result.data);
    });

    return () => {
      mounted = false;
    };
  }, [career, period, store]);
}
