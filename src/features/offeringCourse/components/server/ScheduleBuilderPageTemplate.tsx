import { ScheduleBuilderContainer } from "../client/ScheduleBuilder/ScheduleBuilderContainer";

type Props = {
  career: string;
};

export function ScheduleBuilderPageTemplate({ career }: Props) {
  return <ScheduleBuilderContainer career={career} />;
}