import type { Metadata } from "next";
import { DataSearchProvider } from "@/shared/store/filter/FilterProvider";

export const metadata: Metadata = { title: "Profesores | Connecto" };

export default function ProfessorsLayout({ children }: LayoutProps<"/professors">) {
  return <DataSearchProvider scopeId="professors:list">{children}</DataSearchProvider>;
}
