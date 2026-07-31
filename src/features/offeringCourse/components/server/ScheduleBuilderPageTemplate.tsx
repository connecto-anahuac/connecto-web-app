import { ScheduleBuilderContainer } from "../client/ScheduleBuilder/ScheduleBuilderContainer";
import { DataSearchProvider } from "@/features/search/components/Provider/FilterProvider";

type Props = {
  career: string;
};

export function ScheduleBuilderPageTemplate({ career }: Props) {
  return (
    <DataSearchProvider scopeId={`schedule-builder:${career}`}>
      <ScheduleBuilderContainer career={career} />
    </DataSearchProvider>
  );
}
