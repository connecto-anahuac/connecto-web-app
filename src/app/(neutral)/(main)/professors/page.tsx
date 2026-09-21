import { ProfessorsPageTemplate } from "@/features/professor/components/server/ProfessorsPageTemplate";

export default async function ProfessorsPage({ searchParams }: PageProps<"/professors">) {
  const query = await searchParams;
  const professorId = typeof query.professorId === "string" && query.professorId.trim() ? query.professorId : undefined;
  const period = typeof query.period === "string" && query.period.trim() ? query.period : undefined;
  return <ProfessorsPageTemplate professorId={professorId} period={period} />;
}
