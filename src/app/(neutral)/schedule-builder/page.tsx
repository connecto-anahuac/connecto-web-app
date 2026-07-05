import { ScheduleBuilderPageTemplate } from "@/features/offeringMateria/components/server/ScheduleBuilderPageTemplate";
import { CARRERAS } from "@/types/consts";

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