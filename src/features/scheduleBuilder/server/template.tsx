import OfferingCourseShellContainer from "../client/offeringCourseShell/OfferingCourseShellContainer";
import ScheduleBuilderCanvasContainer from "../client/scheduleBuilderCanvas/ScheduleBuilderCanvasContainer";

type Props = {
    career?: string;
    period?: string;
};

export default function ScheduleBuilderTemplate({ career, period }: Props) { 

    return (
        <div className="flex w-full h-full ">
            <OfferingCourseShellContainer className="shrink-0 h-full" />
            <ScheduleBuilderCanvasContainer className="flex-1 min-w-0 h-full" />
        </div>
    )
}
