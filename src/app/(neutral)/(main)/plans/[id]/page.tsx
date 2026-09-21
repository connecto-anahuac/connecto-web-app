import { PlanPageTemplate } from "@/features/plan/components/server/PlanPageTemplate";

export default async function PlanPage({ params }: PageProps<"/plans/[id]">) {
  const { id } = await params;
  return <PlanPageTemplate planId={id} />;
}
