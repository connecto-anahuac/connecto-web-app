import { PlanDetail } from "../client/PlanDetail";

export function PlanPageTemplate({ planId }: { planId: string }) {
  return <PlanDetail planId={planId} />;
}
