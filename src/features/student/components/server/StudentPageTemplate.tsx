import ContentTitleSection from "@/components/ContentTitleSection";
import { StudentPlanContainer } from "../client/StudentPlan/StudentPlanContainer";
import DataSection from "@/components/datasection/DataSection";

type Props = {
  studentId: string;
};

export function StudentPageTemplate({ studentId }: Props) {
  return <div className="flex flex-col gap-3 pb-5 w-full h-full">
    <ContentTitleSection title={"Alumnos"} />
    <DataSection
      className="w-full flex-1 min-h-0"
      listDiagram={<StudentPlanContainer studentId={studentId} />}
      cardDiagram={<StudentPlanContainer studentId={studentId} />}
    />
    
  </div>;
}