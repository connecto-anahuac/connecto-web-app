import OfferingCourseShellContainer from "../client/offeringCourseShell/OfferingCourseShellContainer";
import ScheduleBuilderCanvasContainer from "../client/scheduleBuilderCanvas/ScheduleBuilderCanvasContainer";

type Props = {
  career: string;
  period: string;
};

export default function ScheduleBuilderTemplate({ career, period }: Props) {
  return (
    <div className="flex h-full w-full">
      <OfferingCourseShellContainer
        career={career}
        period={period}
        className="h-full shrink-0"
      />
      <ScheduleBuilderCanvasContainer className="h-full min-w-0 flex-1" />
    </div>
  );
}
