import type { Metadata } from "next";

export const metadata: Metadata = { title: "Detalle del plan | Connecto" };

export default async function PlanDetailLayout(props: LayoutProps<"/plans/[id]">) {
  await props.params;
  return props.children;
}
