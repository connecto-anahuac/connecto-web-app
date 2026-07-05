"use client";

import { StudentPlanPresenter } from "./StudentPlanPresenter";
import { useStudentPlan } from "./useStudentPlan";

type Props = {
  studentId: string;
};

export function StudentPlanContainer({ studentId }: Props) {
  const { loading, plan, student } = useStudentPlan(studentId);

  return <StudentPlanPresenter loading={loading} plan={plan} student={student} />;
}