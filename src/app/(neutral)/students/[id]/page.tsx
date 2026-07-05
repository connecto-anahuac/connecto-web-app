import { StudentPageTemplate } from "@/features/student/components/server/StudentPageTemplate";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params;
  return <StudentPageTemplate studentId={id} />;
}