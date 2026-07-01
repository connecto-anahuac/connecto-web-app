import StudentTemplate from "@/features/student/components/StudentTemplate";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudentPage({ params }: Props) {
  const { id } = await params;
  return <StudentTemplate studentId={id} />;
}