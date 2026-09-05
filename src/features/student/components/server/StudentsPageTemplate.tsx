import type { ReactNode } from "react";
import { StudentsShellContainer } from "../client/StudentsShell/StudentsShellContainer";
import { StudentCollectionContainer } from "../client/StudentCollection/StudentCollectionContainer";

type Props = {
  children: ReactNode;
};

// コレクション表示
export function StudentsPageTemplate({ children }: Props) {
  return <StudentCollectionContainer />;
  
  // <StudentsShellContainer>{children}</StudentsShellContainer>;
}