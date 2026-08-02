import type { ReactNode } from "react";
import { StudentsShellContainer } from "../client/StudentsShell/StudentsShellContainer";

type Props = {
  children: ReactNode;
};

export function StudentsPageTemplate({ children }: Props) {
  return <StudentsShellContainer>{children}</StudentsShellContainer>;
}