import { ScheduleBuilderPageTemplate } from "@/features/offeringCourse/components/server/ScheduleBuilderPageTemplate";
import { CARRERAS } from "@/shared/types/consts";

export default async function ScheduleBuilderPage({
  searchParams,
}: PageProps<"/schedule-builder/offering-course">) {
  const { career, period } = await searchParams;
  const selectedCareer = CARRERAS.find((candidate) => candidate === career) ?? CARRERAS[2];
  const selectedPeriod =
    typeof period === "string" && period.trim() ? period.trim() : "202660";

  return (
    <ScheduleBuilderPageTemplate
      career={selectedCareer}
      period={selectedPeriod}
    />
  );
}
