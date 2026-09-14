
import ScheduleBuilderTemplate from "@/features/scheduleBuilder/server/template";
import { CARRERAS } from "@/shared/types/consts";

type Props = {
  searchParams: Promise<{
    career?: string;
    period?: string;
  }>;
};

export default async function ScheduleBuilderPage({ searchParams }: Props) {
  const { career,period } = await searchParams;
  const selectedCareer = CARRERAS.find((candidate) => candidate === career) ?? CARRERAS[2];
  const selectedPeriod = period ?? "202660"; // Default period if not provided
  return <ScheduleBuilderTemplate career={selectedCareer} period={selectedPeriod} />;
}