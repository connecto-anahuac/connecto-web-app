
import ScheduleBuilderTemplate from "@/features/scheduleBuilder/server/template";
import { CARRERAS } from "@/shared/types/consts";

export default async function ScheduleBuilderPage(
  props: PageProps<"/schedule-builder/builder">,
) {
  const { career, period } = await props.searchParams;
  const rawCareer = Array.isArray(career) ? career[0] : career;
  const rawPeriod = Array.isArray(period) ? period[0] : period;
  const selectedCareer = CARRERAS.find((candidate) => candidate === rawCareer)
    ?? CARRERAS[2];
  const selectedPeriod = rawPeriod?.trim() || "202660";
  return <ScheduleBuilderTemplate career={selectedCareer} period={selectedPeriod} />;
}
