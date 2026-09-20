"use client";

import type { ImportCsvValidationIssueDto } from "@/external/dto/data/import-csv-result.dto";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type ImportValidationContextValue = {
  issues: ImportCsvValidationIssueDto[];
  setIssues: (issues: ImportCsvValidationIssueDto[]) => void;
};

const ImportValidationContext = createContext<
  ImportValidationContextValue | undefined
>(undefined);

export function ImportValidationProvider({ children }: PropsWithChildren) {
  const [issues, setIssues] = useState<ImportCsvValidationIssueDto[]>([]);
  const value = useMemo(() => ({ issues, setIssues }), [issues]);

  return (
    <ImportValidationContext.Provider value={value}>
      {children}
    </ImportValidationContext.Provider>
  );
}

export function useImportValidation() {
  const value = useContext(ImportValidationContext);
  if (!value) {
    throw new Error(
      "useImportValidation must be used within ImportValidationProvider",
    );
  }
  return value;
}
