import ColumnTitle from "@/shared/component/composite/diagram/ColumnTitle";
import { Diagram } from "@/shared/component/composite/diagram/Diagram";
import RowTitle from "@/shared/component/composite/diagram/RowTitle";
import type { StudyPlanCourseDto } from "@/external/dto/study-plan/study-plan.dto";
import type { FilterResult } from "@/shared/service/dataPipeline/filterDefinition";
import { cn } from "@/shared/lib/util";

export function PlanCourseDiagram({ courses, filterResult }: { courses: readonly StudyPlanCourseDto[]; filterResult: FilterResult }) {
  const maxSemester = Math.max(1, ...courses.map((item) => item.semester));
  const maxPosition = Math.max(1, ...courses.map((item) => item.position));
  return <div className="h-full w-full overflow-auto">
    <Diagram className="w-fit">
      <Diagram.Rows>{Array.from({ length: maxPosition }, (_, index) => <RowTitle key={index} text={String.fromCharCode(65 + index)} />)}</Diagram.Rows>
      <Diagram.Columns>{Array.from({ length: maxSemester }, (_, index) => <ColumnTitle key={index} text={`Semestre ${index + 1}`} />)}</Diagram.Columns>
      {courses.map((course) => <Diagram.Content
        key={course.id}
        x={course.semester}
        y={course.position}
        className={cn("rounded-lg bg-SurfaceContainerLowest p-3 shadow-sm", !filterResult.matches.get(course.id)?.matched && "pointer-events-none opacity-10")}
      >
        <div className="text-xs text-OnSurfaceVariant">{course.keyCode}{course.keyNumber}</div>
        <div className="mt-1 text-sm font-medium text-OnSurface">{course.name}</div>
        <div className="mt-2 text-xs text-OnSurfaceVariant">{course.credits} créditos · {course.hours} horas</div>
      </Diagram.Content>)}
    </Diagram>
  </div>;
}
