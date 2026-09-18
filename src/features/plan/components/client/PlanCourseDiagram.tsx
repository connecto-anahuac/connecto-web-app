import ColumnTitle from "@/shared/component/composite/diagram/ColumnTitle";
import { Diagram } from "@/shared/component/composite/diagram/Diagram";
import RowTitle from "@/shared/component/composite/diagram/RowTitle";
import type { StudyPlanCourseDto } from "@/external/dto/study-plan/study-plan.dto";
import type { FilterResult } from "@/shared/service/dataPipeline/filterDefinition";
import { cn } from "@/shared/lib/util";
import { getOrdinalNumberPrefix } from "@/shared/lib/tool";
import PlanClassCardView from "./ClassCardView";

export function PlanCourseDiagram({
  courses,
  filterResult,
}: {
  courses: readonly StudyPlanCourseDto[];
  filterResult: FilterResult;
}) {
  const maxSemester = Math.max(1, ...courses.map((item) => item.semester));
  const maxPosition = Math.max(1, ...courses.map((item) => item.position + 1));
  return (
    <div className="h-full w-full overflow-auto">
      <Diagram className="w-fit">
        <Diagram.Rows>
          {Array.from({ length: maxPosition }, (_, index) => (
            <RowTitle key={index} text={String.fromCharCode(65 + index)} />
          ))}
        </Diagram.Rows>
        <Diagram.Columns>
          {Array.from({ length: maxSemester }, (_, index) => (
            <ColumnTitle
              key={index}
              text={`${index + 1 + getOrdinalNumberPrefix(index + 1)} Semestre`}
            />
          ))}
        </Diagram.Columns>
        {courses.map((course) => (
          <Diagram.Content
            key={course.id}
            x={course.semester}
            y={course.position + 1}
            className={cn(
              // "rounded-lg bg-SurfaceContainerLowest p-3 shadow-sm",
              !filterResult.matches.get(course.id)?.matched &&
                "pointer-events-none opacity-10",
            )}
          >
            <PlanClassCardView
              className="w-full"
              title={course.name}
              courseCode={course.keyCode}
              courseNumber={course.keyNumber}
              credits={course.credits.toString()}
              hours={course.hours.toString()}
            />
          </Diagram.Content>
        ))}
      </Diagram>
    </div>
  );
}
