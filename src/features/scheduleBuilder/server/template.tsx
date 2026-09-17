import ScheduleBuilderRootContainer from "../client/ScheduleBuilderRoot";

type Props = {
  career: string;
  period: string;
};

export default function ScheduleBuilderTemplate({ career, period }: Props) {
  return <ScheduleBuilderRootContainer career={career} period={period} />;
}
