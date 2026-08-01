"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useStudentsList } from "@/features/students/components/client/StudentsShell/useStudentsList";
import { useStudentFilters } from "@/features/students/components/client/StudentsShell/useStudentFilters";
import { StudentsShellPresenter } from "./StudentsShellPresenter";

type Props = {
  children: ReactNode;
};

export function StudentsShellContainer({ children }: Props) {
  const pathname = usePathname();
  const { students, loading } = useStudentsList();
  const {
    filteredStudents,
    config,
    metadata,
    searchText,
    setSearchText,
    presetState,
    togglePreset,
  } =
    useStudentFilters(students);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const activeStudentId = pathname.startsWith("/students/")
    ? pathname.split("/").at(-1) ?? null
    : null;

  return (
    <StudentsShellPresenter
      activeStudentId={activeStudentId}
      loading={loading}
      students={filteredStudents}
      config={config}
      metadata={metadata}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      isFilterOpen={isFilterOpen}
      onFilterToggle={() => setIsFilterOpen((open) => !open)}
      presetState={presetState}
      onPresetToggle={togglePreset}
    >
      {children}
    </StudentsShellPresenter>
  );
}
