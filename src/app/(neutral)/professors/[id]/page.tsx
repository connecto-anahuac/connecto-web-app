import { ProfessorPageTemplate } from "@/features/professor/components/server/ProfessorPageTemplate";

export default async function ProfessorPage({ params, searchParams }: PageProps<"/professors/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const period = typeof query.period === "string" && query.period.trim() ? query.period : undefined;
  return <ProfessorPageTemplate professorId={id} period={period} />;
}
