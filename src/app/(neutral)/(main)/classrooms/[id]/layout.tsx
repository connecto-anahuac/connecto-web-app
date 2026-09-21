import type { Metadata } from "next";

export const metadata: Metadata = { title: "Detalle del salon | Connecto" };

export default async function ClassroomDetailLayout(props: LayoutProps<"/classrooms/[id]">) {
  await props.params;
  return props.children;
}
