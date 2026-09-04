import type { ReactNode } from "react";
import { StudentsShellContainer } from "../client/StudentsShell/StudentsShellContainer";

type Props = {
  children: ReactNode;
};

// コレクション表示
export function StudentsPageTemplate({ children }: Props) {
  return <StudentsShellContainer>{children}</StudentsShellContainer>;
}