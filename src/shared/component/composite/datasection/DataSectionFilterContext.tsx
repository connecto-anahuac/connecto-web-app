"use client";

import { createContext, useContext } from "react";

type DataSectionFilterContextValue = {
  openFilter: (fieldId: string) => void;
};

const DataSectionFilterContext =
  createContext<DataSectionFilterContextValue | null>(null);

export const DataSectionFilterProvider = DataSectionFilterContext.Provider;

export function useDataSectionFilter() {
  return useContext(DataSectionFilterContext);
}
