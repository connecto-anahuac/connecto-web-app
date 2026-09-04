import { useCallback, useState } from "react";

export const studentDetailTabs = ["overview", "curriculum"] as const;

export type StudentDetailTab = (typeof studentDetailTabs)[number];

const initialStudentDetailTab: StudentDetailTab = "overview";

function isStudentDetailTab(value: string): value is StudentDetailTab {
  return studentDetailTabs.some((tab) => tab === value);
}

export function useStudentDetailTabs() {
  const [selectedTab, setSelectedTab] = useState<StudentDetailTab>(
    initialStudentDetailTab,
  );

  const onTabChange = useCallback((value: string) => {
    if (isStudentDetailTab(value)) {
      setSelectedTab(value);
    }
  }, []);

  return { selectedTab, onTabChange };
}
