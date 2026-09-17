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
} from "../scheduleBuilderStore";

const ScheduleBuilderStoreContext =
  createContext<StoreApi<ScheduleBuilderStore> | null>(null);

export function ScheduleBuilderStoreProvider({ children }: PropsWithChildren) {
  const [store] = useState(createScheduleBuilderStore);
  return (
    <ScheduleBuilderStoreContext.Provider value={store}>
      {children}
    </ScheduleBuilderStoreContext.Provider>
  );
}

export function useScheduleBuilderStoreApi(): StoreApi<ScheduleBuilderStore> {
  const store = useContext(ScheduleBuilderStoreContext);
  if (!store) {
    throw new Error("Schedule Builder store must be used inside ScheduleBuilderStoreProvider");
  }
  return store;
}

export function useScheduleBuilderStore<T>(
  selector: (state: ScheduleBuilderStore) => T,
): T {
  return useStore(useScheduleBuilderStoreApi(), selector);
}
