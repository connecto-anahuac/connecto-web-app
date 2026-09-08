import type { Metadata } from "next";

export const metadata: Metadata = { title: "Detalle del aula | Connecto" };

export default async function ClassroomDetailLayout(props: LayoutProps<"/classrooms/[id]">) {
  await props.params;
  return props.children;
}
