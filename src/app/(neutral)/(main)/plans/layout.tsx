import type { Metadata } from "next";
import { DataSearchProvider } from "@/shared/store/filter/FilterProvider";

export const metadata: Metadata = { title: "Planes de estudio | Connecto" };

export default async function PlansLayout(props: LayoutProps<"/plans">) {
  await props.params;
  return <DataSearchProvider scopeId="plans:list">{props.children}</DataSearchProvider>;
}
