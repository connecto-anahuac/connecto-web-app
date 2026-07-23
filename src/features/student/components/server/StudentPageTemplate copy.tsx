import { StudentPlanContainer } from "../client/StudentPlan/StudentPlanContainer";

type Props = {
  studentId: string;
};

export function StudentPageTemplate({ studentId }: Props) {
  return <StudentPlanContainer studentId={studentId} />;
}