import { StudentsPageContent } from "../client/StudentsPage/StudentsPageContent";

type Props = {
  studentId?: string;
};

export function StudentsPageTemplate({ studentId }: Props) {
  return <StudentsPageContent studentId={studentId} />;
}
