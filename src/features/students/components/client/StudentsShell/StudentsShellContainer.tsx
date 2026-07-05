"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useStudentsList } from "@/features/students/hooks/useStudentsList";
import { StudentsShellPresenter } from "./StudentsShellPresenter";

type Props = {
  children: ReactNode;
};

export function StudentsShellContainer({ children }: Props) {
  const pathname = usePathname();
  const { students, loading } = useStudentsList();
  const activeStudentId = pathname.startsWith("/students/")
    ? pathname.split("/").at(-1) ?? null
    : null;

  return (
    <StudentsShellPresenter
      activeStudentId={activeStudentId}
      loading={loading}
      students={students}
    >
      {children}
    </StudentsShellPresenter>
  );
}