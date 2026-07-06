import { ScheduleBuilderPageTemplate } from "@/features/offeringCourse/components/server/ScheduleBuilderPageTemplate";
import { CARRERAS } from "@/shared/types/consts";

type Props = {
  searchParams: Promise<{
    career?: string;
  }>;
};

export default async function ScheduleBuilderPage({ searchParams }: Props) {
  const { career } = await searchParams;
  const selectedCareer =
    career && CARRERAS.includes(career) ? career : CARRERAS[2];

  return <ScheduleBuilderPageTemplate career={selectedCareer} />;
}