import { ProfessorsPageContent } from "../client/ProfessorsPage/ProfessorsPageContent";

type Props = { professorId?: string; period?: string };

export function ProfessorsPageTemplate(props: Props) {
  return <ProfessorsPageContent {...props} />;
}
