import type { Metadata } from "next";
import { DataSearchProvider } from "@/shared/store/filter/FilterProvider";

export const metadata: Metadata = { title: "Aulas | Connecto" };

export default async function ClassroomsLayout(props: LayoutProps<"/classrooms">) {
  await props.params;
  return <DataSearchProvider scopeId="classrooms:list">{props.children}</DataSearchProvider>;
}
