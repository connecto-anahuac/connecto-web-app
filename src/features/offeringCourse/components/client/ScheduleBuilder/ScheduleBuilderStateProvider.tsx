"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import { useStore } from "zustand";
import type { StoreApi } from "zustand";
import {
  createScheduleBuilderStore,
  type ScheduleBuilderStore,
} from "./scheduleBuilderStore";

const ScheduleBuilderStateContext =
  createContext<StoreApi<ScheduleBuilderStore> | null>(null);

export function ScheduleBuilderStateProvider({ children }: PropsWithChildren) {
  const [store] = useState(createScheduleBuilderStore);

  return (
    <ScheduleBuilderStateContext.Provider value={store}>
      {children}
    </ScheduleBuilderStateContext.Provider>
  );
}

/** Select Schedule Builder state from the closest instance provider. */
export function useScheduleBuilderStore<T>(
  selector: (state: ScheduleBuilderStore) => T,
): T {
  const store = useContext(ScheduleBuilderStateContext);
  if (!store) {
    throw new Error(
      "useScheduleBuilderStore must be used within ScheduleBuilderStateProvider",
    );
  }
  return useStore(store, selector);
}
