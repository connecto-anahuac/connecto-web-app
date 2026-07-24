import { StudentDetailContainer } from "../client/StudentDetail/StudentDetailContainer";

type Props = {
  studentId: string;
};

export function StudentPageTemplate({ studentId }: Props) {
  return <StudentDetailContainer studentId={studentId} />;
}