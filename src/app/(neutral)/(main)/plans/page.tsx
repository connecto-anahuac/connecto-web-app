import { PlansPageTemplate } from "@/features/plan/components/server/PlansPageTemplate";

export default async function PlansPage({ searchParams }: PageProps<"/plans">) {
  const { planId } = await searchParams;
  return <PlansPageTemplate planId={typeof planId === "string" && planId.trim() ? planId : undefined} />;
}
