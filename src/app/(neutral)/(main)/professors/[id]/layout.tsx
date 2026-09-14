import type { Metadata } from "next";

export const metadata: Metadata = { title: "Detalle del profesor | Connecto" };

export default function ProfessorLayout({ children }: LayoutProps<"/professors/[id]">) {
  return children;
}
