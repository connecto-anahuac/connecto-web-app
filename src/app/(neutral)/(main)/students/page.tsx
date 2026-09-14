import { StudentsPageTemplate } from "@/features/student/components/server/StudentsPageTemplate";

export default async function StudentsIndexPage({
  searchParams,
}: PageProps<"/students">) {
  const { studentId } = await searchParams;
  const selectedStudentId =
    typeof studentId === "string" && studentId.trim().length > 0
      ? studentId
      : undefined;

  return <StudentsPageTemplate studentId={selectedStudentId} />;
}
