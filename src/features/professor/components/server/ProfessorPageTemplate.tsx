import { ProfessorDetail } from "../client/ProfessorDetail/ProfessorDetail";

type Props = { professorId: string; period?: string };

export function ProfessorPageTemplate(props: Props) {
  return <ProfessorDetail {...props} />;
}
