import { ScheduleBuilderContainer } from "../client/ScheduleBuilder/ScheduleBuilderContainer";
import { DataSearchProvider } from "@/shared/store/filter/FilterProvider";

type Props = {
  career: string;
  period: string;
};

export function ScheduleBuilderPageTemplate({ career, period }: Props) {
  return (
    <DataSearchProvider scopeId={`schedule-builder:${career}:${period}`}>
      <ScheduleBuilderContainer career={career} period={period} />
    </DataSearchProvider>
  );
}
