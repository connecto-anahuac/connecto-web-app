import { PlanCollection } from "../client/PlanCollection";

export function PlansPageTemplate({ planId }: { planId?: string }) {
  return <PlanCollection activeId={planId} />;
}
