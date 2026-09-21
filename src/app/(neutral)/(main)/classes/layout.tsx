import type { Metadata } from "next";
import { DataSearchProvider } from "@/shared/store/filter/FilterProvider";

export const metadata: Metadata = { title: "Materias | Connecto" };

export default async function ClassesLayout(props: LayoutProps<"/classes">) {
  await props.params;
  return <DataSearchProvider scopeId="classes:list">{props.children}</DataSearchProvider>;
}
